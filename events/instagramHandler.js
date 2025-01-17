const axios = require('axios');
const { notificationsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const POLL_INTERVAL = 60000; // 1 minute

async function fetchInstagramPosts(client) {
    const configs = await notificationsCollection.find({ type: 'instagram' }).toArray();

    for (const config of configs) {
        const { platformId, discordChannelId, guildId, lastNotifiedId, mentionRoles } = config;

        try {
            const response = await axios.get(
                `https://graph.instagram.com/${platformId}/media?fields=id,caption,media_url,permalink&access_token=${INSTAGRAM_ACCESS_TOKEN}`
            );

            const media = response.data.data;

            if (!media || media.length === 0) continue;

            const latestMedia = media[0];
            const mediaId = latestMedia.id;

            if (lastNotifiedId === mediaId) continue;

            const channel = client.channels.cache.get(discordChannelId);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'New Instagram Post!',
                        iconURL: cmdIcons.InstagramIcon,
                        url: 'https://discord.gg/xQF9f9yUEM', 
                    })
                    .setDescription(latestMedia.caption || 'No caption')
                    .setImage(latestMedia.media_url)
                    .setURL(latestMedia.permalink)
                    .setColor('#E4405F')
                    .setFooter({
                        text: `Make sure to check out recent posts!`,
                        iconURL: cmdIcons.msgIcon,
                    })
                    .setTimestamp();

                const mentionText = mentionRoles && mentionRoles.length > 0
                    ? mentionRoles.map(roleId => `<@&${roleId}>`).join(' ')
                    : '';

                await channel.send({ content: mentionText, embeds: [embed] });

                await notificationsCollection.updateOne(
                    { guildId, platformId },
                    { $set: { lastNotifiedId: mediaId } }
                );
            }
        } catch (error) {
            //console.error('Error fetching Instagram posts:', error);
        }
    }
}

function startInstagramNotifications(client) {
    setInterval(() => fetchInstagramPosts(client), POLL_INTERVAL);
}

module.exports = startInstagramNotifications;
