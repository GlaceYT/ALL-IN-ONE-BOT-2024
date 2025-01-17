const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
module.exports = async function voiceJoinHandler(client) {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        if (!newState.channel || oldState.channelId === newState.channelId) return;

        const config = await logsCollection.findOne({ guildId: newState.guild.id, eventType: 'voiceJoin' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle('🎤 Voice Channel Joined')
                .setColor('#00FFFF')
                .addFields(
                    { name: 'User', value: `${newState.member.user.tag} (${newState.member.id})`, inline: true },
                    { name: 'Channel', value: `${newState.channel.name} (${newState.channel.id})`, inline: true },
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
