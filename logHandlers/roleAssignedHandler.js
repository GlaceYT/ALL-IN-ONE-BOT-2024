const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
module.exports = async function roleAssignedHandler(client) {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (addedRoles.size === 0) return;

        const config = await logsCollection.findOne({ guildId: newMember.guild.id, eventType: 'roleAssigned' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
            addedRoles.forEach(role => {
                const embed = new EmbedBuilder()
                    .setTitle('🔵 Role Assigned')
                    .setColor('#0000FF')
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
