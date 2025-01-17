const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
module.exports = async function roleRemovedHandler(client) {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (removedRoles.size === 0) return;

        const config = await logsCollection.findOne({ guildId: newMember.guild.id, eventType: 'roleRemoved' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
            removedRoles.forEach(role => {
                const embed = new EmbedBuilder()
                    .setTitle('🔴 Role Removed')
                    .setColor('#FF0000')
                    .addFields(
                        { name: 'User', value: `${newMember.user.tag} (${newMember.id})`, inline: true },
                        { name: 'Role', value: role.name, inline: true },
                    )
                    .setTimestamp();

                logChannel.send({ embeds: [embed] });
            });
        }
    });
};
