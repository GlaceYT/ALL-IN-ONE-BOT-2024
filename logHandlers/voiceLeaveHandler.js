const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
module.exports = async function voiceLeaveHandler(client) {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        if (!oldState.channel || oldState.channelId === newState.channelId) return;

        const config = await logsCollection.findOne({ guildId: oldState.guild.id, eventType: 'voiceLeave' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle('🎤 Voice Channel Left')
                .setColor('#FF9900')
                .addFields(
                    { name: 'User', value: `${oldState.member.user.tag} (${oldState.member.id})`, inline: true },
                    { name: 'Channel', value: `${oldState.channel.name} (${oldState.channel.id})`, inline: true },
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
