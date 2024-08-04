const { PermissionsBitField } = require('discord.js');
const antisetup = require('../antisetup.json');

const antiNuke = (client) => {
    const nukeMap = new Map();
    console.log('\x1b[36m[ SECUTIRY ]\x1b[0m', '\x1b[32mAnti - Nuke System Active ✅\x1b[0m');
    client.on('channelDelete', async (channel) => {
        const guild = channel.guild;
        const settings = antisetup[guild.id]?.antiNuke;
        if (!settings?.enabled) return;

        const currentTime = Date.now();
        const nukeData = nukeMap.get(channel.id) || { deletions: 0, lastDeletion: currentTime };

        if (currentTime - nukeData.lastDeletion < settings.channelDeleteTime) {
            nukeData.deletions += 1;
        } else {
            nukeData.deletions = 1;
        }

        nukeData.lastDeletion = currentTime;
        nukeMap.set(channel.id, nukeData);

        const logChannel = guild.channels.cache.get(antisetup[guild.id].logChannelId);

        if (nukeData.deletions > settings.channelDeleteLimit) {
            const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_DELETE' });
            const deleteLog = auditLogs.entries.first();

            if (deleteLog) {
                const { executor } = deleteLog;
                const executorMember = guild.members.cache.get(executor.id);
                if (executorMember && !executorMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    executorMember.ban({ reason: 'Anti-nuke: Deleting channels' });
                    guild.owner.send(`User ${executor.tag} has been banned for attempting a nuke attack.`);
                    logChannel?.send(`User ${executor.tag} banned for deleting multiple channels.`);
                }
            }
        }
    });

    client.on('guildBanAdd', async (ban) => {
        const guild = ban.guild;
        const settings = antisetup[guild.id]?.antiNuke;
        if (!settings?.enabled) return;

        const auditLogs = await guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_ADD' });
        const banLog = auditLogs.entries.first();

        const logChannel = guild.channels.cache.get(antisetup[guild.id].logChannelId);

        if (banLog) {
            const { executor, target } = banLog;
            if (target.id === ban.user.id) {
                const executorMember = guild.members.cache.get(executor.id);
                if (executorMember && !executorMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    executorMember.ban({ reason: 'Anti-nuke: Banning members' });
                    guild.owner.send(`User ${executor.tag} has been banned for attempting a nuke attack.`);
                    logChannel?.send(`User ${executor.tag} banned for banning members.`);
                }
            }
        }
    });
};

module.exports = antiNuke;
