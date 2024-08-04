const { Manager } = require('erela.js');
const Spotify = require('erela.js-spotify');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../config.json');
const axios = require('axios');
const { Dynamic } = require("musicard");
const fs = require('fs');
const musicIcons = require('../UI/icons/musicicons');

async function getSpotifyToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Authorization': `Basic ${Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data.access_token;
}

async function getSpotifyTrackId(token, songName) {
    const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
            q: songName,
            type: 'track',
            limit: 1
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const track = response.data.tracks.items[0];
    return track ? track.id : null;
}

async function getSpotifyThumbnail(token, trackId) {
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data.album.images[0]?.url || '';
}

module.exports = (client) => {
    
    if (config.excessCommands.lavalink) {
        client.manager = new Manager({
            nodes: [
                {
                    host: config.lavalink.lavalink.host,
                    port: config.lavalink.lavalink.port,
                    password: config.lavalink.lavalink.password,
                    secure: config.lavalink.lavalink.secure
                }
            ],
            plugins: [
                new Spotify({
                    clientID: config.spotifyClientId,
                    clientSecret: config.spotifyClientSecret
                })
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        });

        client.manager.on('nodeConnect', node => {
            console.log(`\x1b[34m[ LAVALINK CONNECTION ]\x1b[0m Node connected: \x1b[32m${node.options.identifier}\x1b[0m`);
        });

        client.manager.on('nodeError', (node, error) => {
            if (error.message.includes('Unexpected op "ready"')) {
                return;
            }
            console.error(`\x1b[31m[ERROR]\x1b[0m Node \x1b[32m${node.options.identifier}\x1b[0m had an error: \x1b[33m${error.message}\x1b[0m`);
        });

        client.manager.on('trackStart', async (player, track) => {
            const channel = client.channels.cache.get(player.textChannel);

            try {
                const accessToken = await getSpotifyToken();
                const trackId = await getSpotifyTrackId(accessToken, track.title);

                if (!trackId) {
                    throw new Error(`Track ID not found for song: ${track.title}`);
                }

                const thumbnailUrl = await getSpotifyThumbnail(accessToken, trackId);
                const data = require('../UI/banners/musicard');
                const randomIndex = Math.floor(Math.random() * data.backgroundImages.length);
                const backgroundImage = data.backgroundImages[randomIndex];
                const musicCard = await Dynamic({
                    thumbnailImage: thumbnailUrl,
                    name: track.title,
                    author: track.author,
                    authorColor: "#FF7A00",
                    progress: 50,
                    imageDarkness: 60,
                    nameColor: "#FFFFFF",
                    progressColor: "#FF7A00",
                    backgroundImage: backgroundImage,
                    progressBarColor: "#5F2D00",
                });

                fs.writeFileSync('musicard.png', musicCard);

                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: "Now playing",
                        iconURL: musicIcons.playerIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setDescription(`- Song name :**${track.title}**\n- Author :**${track.author}**`)
                    .setImage('attachment://musicard.png')
                    .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })
                    .setColor('#FF00FF');

                const attachment = new AttachmentBuilder('musicard.png', { name: 'musicard.png' });

                await channel.send({ embeds: [embed], files: [attachment] });
            } catch (error) {
                console.error('Error creating or sending music card:', error);
            }
        });

        client.manager.on('queueEnd', player => {
            const channel = client.channels.cache.get(player.textChannel);
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "Queue is Empty",
                    iconURL: musicIcons.beatsIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription('**Leaving voice channel!**')
                .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })
                .setColor('#FFFF00');
            channel.send({ embeds: [embed] });
            player.destroy();
        });

        client.on('raw', d => client.manager.updateVoiceState(d));

        client.once('ready', () => {
            console.log('\x1b[35m[ MUSIC 2 ]\x1b[0m', '\x1b[32mLavalink Music System Active ✅\x1b[0m');
            client.manager.init(client.user.id);
        });
    } else {
        console.log('\x1b[31m[ MUSIC 2 ]\x1b[0m', '\x1b[31mLavalink Music System Disabled ❌\x1b[0m');
    }
};
