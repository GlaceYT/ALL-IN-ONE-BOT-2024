const { logsCollection } = require('../mongodb');
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = async function channelDeleteHandler(client) {
    client.on('channelDelete', async (channel) => {
        const config = await logsCollection.findOne({ guildId: channel.guild.id, eventType: 'channelDelete' });
        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {
  
            const channelType = {
                [ChannelType.GuildText]: 'Text Channel',
                [ChannelType.GuildVoice]: 'Voice Channel',
                [ChannelType.GuildCategory]: 'Category',
                [ChannelType.GuildAnnouncement]: 'Announcement Channel',
                [ChannelType.GuildStageVoice]: 'Stage Channel',
                [ChannelType.GuildForum]: 'Forum Channel',
                [ChannelType.PublicThread]: 'Public Thread',
                [ChannelType.PrivateThread]: 'Private Thread',
                [ChannelType.GuildDirectory]: 'Directory Channel',
            }[channel.type] || 'Unknown Type';

            const embed = new EmbedBuilder()
                .setTitle('🗑️ Channel Deleted')
                .setColor('#FF0000')
                .addFields(
                    { name: 'Channel', value: `${channel.name} (${channel.id})`, inline: true },
                    { name: 'Type', value: channelType, inline: true },
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
