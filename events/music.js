const { Manager } = require('erela.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const config = require('../config.json');
const { Dynamic } = require("musicard");
const fs = require('fs');
const musicIcons = require('../UI/icons/musicicons');

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
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        });

        client.manager.on('nodeConnect', node => {
            console.log(`\x1b[34m[ LAVALINK CONNECTION ]\x1b[0m Node connected: \x1b[32m${node.options.identifier}\x1b[0m`);
        });

        client.manager.on('nodeError', (node, error) => {
            //console.error(`\x1b[31m[ LAVALINK ]\x1b[0m Node \x1b[32m${node.options.identifier}\x1b[0m had an error: \x1b[33m${error.message}\x1b[0m`);
        });

        client.manager.on('trackStart', async (player, track) => {
            const channel = client.channels.cache.get(player.textChannel);

            try {
                // Assuming the track URI is a YouTube link, you can extract the video ID and use it to fetch a thumbnail
                let thumbnailUrl = '';
                if (track.uri.includes('youtube.com') || track.uri.includes('youtu.be')) {
                    const videoId = track.uri.split('v=')[1] || track.uri.split('/').pop();
                    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }

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
