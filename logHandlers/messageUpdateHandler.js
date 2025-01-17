const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
module.exports = async function messageUpdateHandler(client) {
    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (!oldMessage.guild || oldMessage.partial || newMessage.partial) return;

        const config = await logsCollection.findOne({ guildId: oldMessage.guild.id, eventType: 'messageUpdate' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setTitle('✏️ Message Edited')
                .setColor('#FFFF00')
                .addFields(
                    { name: 'Author', value: oldMessage.author?.tag || 'Unknown', inline: true },
                    { name: 'Channel', value: `<#${oldMessage.channel.id}>`, inline: true },
                    { name: 'Old Content', value: oldMessage.content || '*No content*' },
                    { name: 'New Content', value: newMessage.content || '*No content*' },
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
