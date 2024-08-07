const { Client, GatewayIntentBits } = require('discord.js');
const { nqnCollection } = require('../mongodb');

async function loadNqnConfig() {
    try {
        const configs = await nqnCollection.find().toArray();
        return configs.reduce((acc, config) => {
            acc[config.serverId] = config;
            return acc;
        }, {});
    } catch (err) {
        //console.error('Error loading NQN config:', err);
        return {};
    }
}

module.exports = async (client) => {
    let nqnConfig = await loadNqnConfig();

    setInterval(async () => {
        nqnConfig = await loadNqnConfig();
    }, 5000);

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const guildId = message.guild.id;
        const settings = nqnConfig[guildId];
        if (!settings || !settings.status) return;

        const emojiRegex = /:(\w+):/g;
        const matches = [...message.content.matchAll(emojiRegex)];

        if (matches.length > 0) {
            const emojiGuilds = client.guilds.cache;
            const emojis = [];

            for (const [_, emojiName] of matches) {
                const emoji = emojiGuilds.map(guild => guild.emojis.cache.find(e => e.name === emojiName && e.animated)).find(e => e);
                if (emoji) {
                    emojis.push({ name: emojiName, emoji: emoji.toString() });
                }
            }

            if (emojis.length > 0) {
                let response = message.content;
                for (const { name, emoji } of emojis) {
                    response = response.replace(new RegExp(`:${name}:`, 'g'), emoji);
                }

                try {
                    const webhook = await message.channel.createWebhook({
                        name: message.member.displayName,
                        avatar: message.author.displayAvatarURL(),
                    });

                    await webhook.send({
                        content: response,
                        username: message.member.displayName,
                        avatarURL: message.author.displayAvatarURL(),
                    });

                    await webhook.delete();

                    try {
                        await message.delete();
                    } catch (deleteError) {
                        console.error('Failed to delete the original message:', deleteError);
                    }
                } catch (error) {
                    console.error('Failed to create or send webhook message:', error);
                }
            }
        }
    });

    client.on('ready', () => {
        console.log('\x1b[36m[ NQN ]\x1b[0m', '\x1b[32mNQN Module Active ✅\x1b[0m');
    });

    client.on('error', (error) => {
        console.error('An error occurred:', error);
    });

    client.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
};
