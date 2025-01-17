const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
module.exports = async function memberJoinHandler(client) {
    client.on('guildMemberAdd', async (member) => {
        const config = await logsCollection.findOne({ guildId: member.guild.id, eventType: 'memberJoin' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle('🎉 Member Joined')
                .setColor('#00FF00')
                .addFields(
                    { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                    { name: 'Joined At', value: new Date().toLocaleString(), inline: true },
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
