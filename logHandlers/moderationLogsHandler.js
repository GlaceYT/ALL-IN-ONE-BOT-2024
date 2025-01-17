const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');

module.exports = async function moderationLogsHandler(client) {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        const guildId = newMember.guild.id;

        // Fetch config
        const config = await logsCollection.findOne({ guildId, eventType: 'moderationLogs' });
        if (!config || !config.channelId) return;

        const logChannel = newMember.guild.channels.cache.get(config.channelId);

        // Check for timeout updates
        if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
            const embed = new EmbedBuilder()
                .setTitle('⏳ Timeout Updated')
                .setColor('#FF9900')
                .addFields(
                    { name: 'User', value: `${newMember.user.tag} (${newMember.id})`, inline: true },
                    { name: 'Timeout Until', value: newMember.communicationDisabledUntil
                        ? `<t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:F>`
                        : '*None*', inline: true },
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
