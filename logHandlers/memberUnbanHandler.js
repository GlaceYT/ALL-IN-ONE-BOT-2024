const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
module.exports = async function memberUnbanHandler(client) {
    client.on('guildBanRemove', async (ban) => {
        const config = await logsCollection.findOne({ guildId: ban.guild.id, eventType: 'memberUnban' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle('🔓 Member Unbanned')
                .setColor('#00FF00')
                .addFields(
                    { name: 'User', value: `${ban.user.tag} (${ban.user.id})`, inline: true },
                )
                .setThumbnail(ban.user.displayAvatarURL())
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
