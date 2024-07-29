const antisetup = require('../antisetup.json');

const antiLink = (client) => {
    const linkMap = new Map();
    console.log('\x1b[36m[ SECUTIRY ]\x1b[0m', '\x1b[32mAnti - Link System Active ✅\x1b[0m');
    client.on('messageCreate', (message) => {
        if (!message.guild) return;
        const settings = antisetup[message.guild.id]?.antiLink;
        if (!settings?.enabled) return;

        const { author, content, channel } = message;
        if (author.bot) return;

        const linkRegex = /https?:\/\/\S+/gi;
        const logChannel = message.guild.channels.cache.get(antisetup[message.guild.id].logChannelId);

        if (linkRegex.test(content)) {
            if (settings.mode === 'full') {
                message.delete();
                channel.send(`${author}, posting links is not allowed!`);
                logChannel?.send(`User ${author.tag} posted a link and the message was deleted.`);
            } else if (settings.mode === 'partial') {
                const currentTime = Date.now();
                const lastLinkTime = linkMap.get(author.id) || 0;

                if (currentTime - lastLinkTime < settings.linkInterval) {
                    message.delete();
                    channel.send(`${author}, you can only post links every ${settings.linkInterval / 1000} seconds!`);
                    logChannel?.send(`User ${author.tag} posted a link too soon and the message was deleted.`);
                } else {
                    linkMap.set(author.id, currentTime);
                }
            }
        }
    });
};

module.exports = antiLink;
