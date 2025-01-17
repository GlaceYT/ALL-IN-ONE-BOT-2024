const axios = require('axios');
const { notificationsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');
const cmdIcons = require('../UI/icons/commandicons'); 
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;
const POLL_INTERVAL = 60000; // 1 minute

async function fetchTwitchStreams(client) {
    const configs = await notificationsCollection.find({ type: 'twitch' }).toArray();

    for (const config of configs) {
        const { platformId, discordChannelId, guildId, lastNotifiedId, mentionRoles } = config;

        try {
            const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${platformId}`, {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`,
                },
            });

            const streams = response.data.data;

            if (!streams || streams.length === 0) continue;

            const latestStream = streams[0];
            const streamId = latestStream.id;

            if (lastNotifiedId === streamId) continue;

            const channel = client.channels.cache.get(discordChannelId);
            if (channel) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'New content Uploaded!',
                        iconURL: cmdIcons.TwitchIcon,
                        url: 'https://discord.gg/xQF9f9yUEM', 
                    })
                    .setDescription(`[Watch Now](https://www.twitch.tv/${latestStream.user_name})`)
                    .addFields({ name: 'Game', value: latestStream.game_name, inline: true })
                    .setURL(`https://www.twitch.tv/${latestStream.user_name}`)
                    .setColor('#9146FF')
                    .setImage(latestStream.thumbnail_url.replace('{width}', '320').replace('{height}', '180'))
                    .setFooter({
                        text: `Make sure to check out recent videos!`,
                        iconURL: cmdIcons.msgIcon,
                    })
                    .setTimestamp();

                const mentionText = mentionRoles && mentionRoles.length > 0
                    ? mentionRoles.map(roleId => `<@&${roleId}>`).join(' ')
                    : '';

                await channel.send({ content: mentionText, embeds: [embed] });

                await notificationsCollection.updateOne(
                    { guildId, platformId },
                    { $set: { lastNotifiedId: streamId } }
                );
            }
        } catch (error) {
            //console.error('Error fetching Twitch streams:', error);
        }
    }
}

function startTwitchNotifications(client) {
    setInterval(() => fetchTwitchStreams(client), POLL_INTERVAL);
}

module.exports = startTwitchNotifications;
