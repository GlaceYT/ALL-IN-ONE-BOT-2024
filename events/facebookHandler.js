const axios = require('axios');
const { notificationsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const POLL_INTERVAL = 60000; // 1 minute

async function fetchFacebookPosts(client) {
    const configs = await notificationsCollection.find({ type: 'facebook' }).toArray();

    for (const config of configs) {
        const { platformId, discordChannelId, guildId, lastNotifiedId, mentionRoles } = config;

        try {
            const response = await axios.get(
                `https://graph.facebook.com/v15.0/${platformId}/posts?access_token=${FACEBOOK_ACCESS_TOKEN}`
            );

            const posts = response.data.data;

            if (!posts || posts.length === 0) continue;

            const latestPost = posts[0];
            const postId = latestPost.id;

            if (lastNotifiedId === postId) continue;

            const channel = client.channels.cache.get(discordChannelId);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'New Facebook Post!',
                        iconURL: cmdIcons.FaceBookIcon,
                        url: 'https://discord.gg/xQF9f9yUEM', 
                    })
                    .setDescription(`[View Post](https://www.facebook.com/${postId})`)
                    .setURL(`https://www.facebook.com/${postId}`)
                    .setColor('#1877F2')
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
                    { $set: { lastNotifiedId: postId } }
                );
            }
        } catch (error) {
            //console.error('Error fetching Facebook posts:', error);
        }
    }
}

function startFacebookNotifications(client) {
    setInterval(() => fetchFacebookPosts(client), POLL_INTERVAL);
}

module.exports = startFacebookNotifications;
