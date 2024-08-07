const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { antisetupCollection } = require('../mongodb');

const antiRaid = (client) => {
    const joinMap = new Map();
    console.log('\x1b[36m[ SECURITY ]\x1b[0m', '\x1b[32mAnti - Raid System Active ✅\x1b[0m');

    client.on('guildMemberAdd', async (member) => {
        const guild = member.guild;

        try {
            const settings = await antisetupCollection.findOne({ serverId: guild.id });
            const antiRaidSettings = settings?.antiRaid;

            if (!antiRaidSettings?.enabled) return;

            const currentTime = Date.now();
            const newMembers = joinMap.get(guild.id) || [];

          
            newMembers.push({ id: member.id, joinedAt: currentTime });
            joinMap.set(guild.id, newMembers);

    
            const recentJoins = newMembers.filter(m => currentTime - m.joinedAt < antiRaidSettings.timeWindow);

            const logChannel = guild.channels.cache.get(settings.logChannelId);

            if (recentJoins.length > antiRaidSettings.joinLimit) {
                for (const m of recentJoins) {
                    const raidMember = guild.members.cache.get(m.id);
                    if (raidMember) {
                        await raidMember.ban({ reason: 'Anti-raid: Rapid joining' });

                        const embed = new EmbedBuilder()
                            .setColor('#ff0000')
                            .setTitle('Anti-Raid: Rapid Joining')
                            .setDescription(`User ${raidMember.user.tag} has been banned for rapid joining.`)
                            .addFields(
                                { name: 'User', value: `${raidMember.user.tag} (${raidMember.id})`, inline: true },
                                { name: 'Join Time', value: new Date(m.joinedAt).toLocaleString(), inline: true },
                                { name: 'Total Joins', value: `${recentJoins.length}`, inline: false }
                            )
                            .setTimestamp();

                        if (logChannel) {
                            await logChannel.send({ embeds: [embed] });
                        } else {
                            //console.error('Log channel not found or bot lacks permissions.');
                        }
                    }
                }

               
                try {
                    await guild.owner.send('A raid attempt was detected and prevented.');
                } catch (error) {
                    //console.error('Failed to notify guild owner:', error);
                }
            }
        } catch (error) {
            //console.error('Error fetching server configuration or processing data:', error);
        }
    });
};

module.exports = antiRaid;
