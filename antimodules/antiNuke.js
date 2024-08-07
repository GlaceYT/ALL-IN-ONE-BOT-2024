const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { antisetupCollection } = require('../mongodb');

const antiNuke = (client) => {
    const nukeMap = new Map();
    console.log('\x1b[36m[ SECURITY ]\x1b[0m', '\x1b[32mAnti - Nuke System Active ✅\x1b[0m');

    client.on('channelDelete', async (channel) => {
        if (!channel.guild) return;

        const guildConfig = await antisetupCollection.findOne({ serverId: channel.guild.id });

        if (!guildConfig || !guildConfig.antiNuke || !guildConfig.antiNuke.enabled) {
            console.log(`No anti-nuke settings found or not enabled for guild ${channel.guild.id}`);
            return;
        }

        const settings = guildConfig.antiNuke;

        const currentTime = Date.now();
        const nukeData = nukeMap.get(channel.guild.id) || { deletions: 0, lastDeletion: currentTime };

        if (currentTime - nukeData.lastDeletion < settings.channelDeleteTime) {
            nukeData.deletions += 1;
        } else {
            nukeData.deletions = 1;
        }

        nukeData.lastDeletion = currentTime;
        nukeMap.set(channel.guild.id, nukeData);

        const logChannel = channel.guild.channels.cache.get(guildConfig.logChannelId);

        if (nukeData.deletions > settings.channelDeleteLimit) {
            try {
                const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, actionType: 12 }); 
                const deleteLog = auditLogs.entries.first();

                if (deleteLog) {
                    const { executor } = deleteLog;
                    const executorMember = channel.guild.members.cache.get(executor.id);
                    if (executorMember && !executorMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        await executorMember.ban({ reason: 'Anti-nuke: Deleting channels' });

                       
                        const owner = await channel.guild.fetchOwner();
                        if (owner) {
                            await owner.send(`User ${executor.tag} has been banned for attempting a nuke attack by deleting multiple channels.`);
                        } else {
                            //console.error('Guild owner could not be fetched.');
                        }

                     
                        const embed = new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('Anti-Nuke: Channel Deletion')
                            .setDescription(`User ${executor.tag} has been banned for deleting multiple channels.`)
                            .addFields(
                                { name: 'User', value: `${executor.tag} (${executor.id})`, inline: true },
                                { name: 'Deleted Channels', value: `${nukeData.deletions}`, inline: true },
                                { name: 'Deletion Time', value: new Date(currentTime).toLocaleString(), inline: false }
                            )
                            .setTimestamp();

                        if (logChannel) {
                            await logChannel.send({ embeds: [embed] });
                        } else {
                            console.error('Log channel not found or bot lacks permissions.');
                        }
                    }
                }
            } catch (error) {
                //console.error('Failed to fetch audit logs or process data:', error);
            }
        }
    });

    client.on('guildBanAdd', async (ban) => {
        if (!ban.guild) return;

        const guildConfig = await antisetupCollection.findOne({ serverId: ban.guild.id });

        if (!guildConfig || !guildConfig.antiNuke || !guildConfig.antiNuke.enabled) {
            //console.log(`No anti-nuke settings found or not enabled for guild ${ban.guild.id}`);
            return;
        }

        const settings = guildConfig.antiNuke;

        try {
            const auditLogs = await ban.guild.fetchAuditLogs({ limit: 1, actionType: 22 }); 
            const banLog = auditLogs.entries.first();

            const logChannel = ban.guild.channels.cache.get(guildConfig.logChannelId);

            if (banLog) {
                const { executor, target } = banLog;
                if (target.id === ban.user.id) {
                    const executorMember = ban.guild.members.cache.get(executor.id);
                    if (executorMember && !executorMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        await executorMember.ban({ reason: 'Anti-nuke: Banning members' });

                     
                        const owner = await ban.guild.fetchOwner();
                        if (owner) {
                            await owner.send(`User ${executor.tag} has been banned for attempting a nuke attack by banning members.`);
                        } else {
                            console.error('Guild owner could not be fetched.');
                        }

                
                        const embed = new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('Anti-Nuke: Member Ban')
                            .setDescription(`User ${executor.tag} has been banned for banning members.`)
                            .addFields(
                                { name: 'User', value: `${executor.tag} (${executor.id})`, inline: true },
                                { name: 'Banned Member', value: `${ban.user.tag} (${ban.user.id})`, inline: true },
                                { name: 'Ban Time', value: new Date().toLocaleString(), inline: false }
                            )
                            .setTimestamp();

                        if (logChannel) {
                            await logChannel.send({ embeds: [embed] });
                        } else {
                            //console.error('Log channel not found or bot lacks permissions.');
                        }
                    }
                }
            }
        } catch (error) {
            //console.error('Failed to fetch audit logs or process data:', error);
        }
    });
};

module.exports = antiNuke;
