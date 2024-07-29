const { PermissionsBitField } = require('discord.js');
const antisetup = require('../antisetup.json');

const antiSpam = (client) => {
    const spamMap = new Map();
    console.log('\x1b[36m[ SECUTIRY ]\x1b[0m', '\x1b[32mAnti - Spam System Active ✅\x1b[0m');
    client.on('messageCreate', (message) => {
        if (!message.guild) return;
        const settings = antisetup[message.guild.id]?.antiSpam;
        if (!settings?.enabled) return;

        const { author, content, channel } = message;
        if (author.bot) return;

        const currentTime = Date.now();
        const userSpamData = spamMap.get(author.id) || { lastMessage: currentTime, messageCount: 0 };

        if (currentTime - userSpamData.lastMessage < settings.timeWindow) {
            userSpamData.messageCount += 1;
        } else {
            userSpamData.messageCount = 1;
        }

        userSpamData.lastMessage = currentTime;
        spamMap.set(author.id, userSpamData);

        if (userSpamData.messageCount > settings.messageCount) {
            const logChannel = message.guild.channels.cache.get(antisetup[message.guild.id].logChannelId);

            if (settings.action === 'warn') {
                channel.send(`${author}, please stop spamming!`);
                logChannel?.send(`User ${author.tag} warned for spamming.`);
            } else if (settings.action === 'timeout') {
                const member = channel.guild.members.cache.get(author.id);
                if (member) {
                    member.timeout(settings.duration, 'Spamming');
                    logChannel?.send(`User ${author.tag} muted for spamming for ${settings.duration / 1000} seconds.`);
                }
            }
            spamMap.delete(author.id);
        }
    });
};

module.exports = antiSpam;
