const axios = require('axios');
const { notificationsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
const cmdIcons = require('../UI/icons/commandicons'); 
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const POLL_INTERVAL = 60000;
const FALLBACK_THUMBNAIL = 'https://i.ibb.co/8Nq8kKr/youtube-thumbnails.jpg';

async function fetchLatestVideos(client) {
    const configs = await notificationsCollection.find({ type: 'youtube' }).toArray();

    for (const config of configs) {
        const { platformId, discordChannelId, guildId, lastNotifiedId, mentionRoles } = config;

        try {
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${platformId}&part=snippet&type=video&order=date&maxResults=1`
            );

            const videos = response.data.items;

            if (!videos || videos.length === 0) continue;

            const latestVideo = videos[0];
            const videoId = latestVideo.id.videoId;

            if (lastNotifiedId === videoId) continue; 

            const channel = client.channels.cache.get(discordChannelId);
            if (channel) {
              
                const thumbnailUrl =
                    latestVideo.snippet.thumbnails?.high?.url || FALLBACK_THUMBNAIL;

               
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'New Video Uploaded!',
                        iconURL: cmdIcons.YouTubeIcon,
                        url: 'https://discord.gg/xQF9f9yUEM', 
                    })
                    .setDescription(`Check out the new Video : [${latestVideo.snippet.title}](https://www.youtube.com/watch?v=${videoId})`)
                    .setURL(`https://www.youtube.com/watch?v=${videoId}`)
                    .setColor('#FF0000')
                    .setImage(thumbnailUrl)
                    .addFields(
                        { name: 'Channel', value: latestVideo.snippet.channelTitle, inline: true },
                        {
                            name: 'Published At',
                            value: new Date(latestVideo.snippet.publishedAt).toLocaleString(),
                            inline: true,
                        }
                    )
                    .setFooter({
                        text: latestVideo.snippet.channelTitle,
                        iconURL: cmdIcons.msgIcon,
                    })
                    .setTimestamp();

              
                const mentionText = mentionRoles && mentionRoles.length > 0
                    ? mentionRoles.map(roleId => `<@&${roleId}>`).join(' ')
                    : '';

             
                await channel.send({
                    content: mentionText,
                    embeds: [embed],
                });

             
                await notificationsCollection.updateOne(
                    { guildId, type: 'youtube', platformId },
                    { $set: { lastNotifiedId: videoId } }
                );
            }
        } catch (error) {
            //console.error('Error fetching or notifying YouTube videos:', error);
        }
    }
}

function startYouTubeNotifications(client) {
    setInterval(() => fetchLatestVideos(client), POLL_INTERVAL);
}

module.exports = startYouTubeNotifications;
