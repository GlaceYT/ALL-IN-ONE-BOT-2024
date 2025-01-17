const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
module.exports = async function memberLeaveHandler(client) {
    client.on('guildMemberRemove', async (member) => {
        const config = await logsCollection.findOne({ guildId: member.guild.id, eventType: 'memberLeave' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle('🚶 Member Left')
                .setColor('#FF9900')
                .addFields(
                    { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                    { name: 'Left At', value: new Date().toLocaleString(), inline: true },
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
