const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const axios = require('axios');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const {  Dynamic } = require('musicard'); 
const config = require('./config.json');
const { printWatermark } = require('./events/handler');
const { EmbedBuilder } = require('@discordjs/builders');
const musicIcons = require('./UI/icons/musicicons'); 
const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a) => {
      return GatewayIntentBits[a];
    }),
  });


client.commands = new Collection();


const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

let totalCommands = 0; 

const commands = [];
const logDetails = []; 
printWatermark();
console.log('\x1b[33m%s\x1b[0m', '┌───────────────────────────────────────────┐');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
    const numCommands = commandFiles.length;

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, folder, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }

    const folderDetails = `Folder: ${folder}, Number of commands: ${numCommands}`;
    logDetails.push(folderDetails);
    console.log('\x1b[33m%s\x1b[0m', `│ ${folderDetails.padEnd(34)} `);
    totalCommands += numCommands; 
}
console.log('\x1b[35m%s\x1b[0m', `│ Total number of commands: ${totalCommands}`);
console.log('\x1b[33m%s\x1b[0m', '└───────────────────────────────────────────┘');



const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}



async function fetchExpectedCommandsCount() {
    try {
        const response = await axios.get('https://server-backend-tdpa.onrender.com/api/expected-commands-count');
        return response.data.expectedCommandsCount;
    } catch (error) {
        return -1;
    }
}

async function verifyCommandsCount() {
    const expectedCommandsCount = await fetchExpectedCommandsCount();
    const registeredCommandsCount = client.commands.size;

    if (expectedCommandsCount === -1) {
        console.log('\x1b[33m[ WARNING ]\x1b[0m', '\x1b[32mUnbale to verify commands [ SERVER OFFLINE ]\x1b[0m');
        return;
    }

    if (registeredCommandsCount !== expectedCommandsCount) {
        console.log(
            '\x1b[33m[ WARNING ]\x1b[0m \x1b[32mWarning: Bot commands count (%d) does not match expected count (%d).\x1b[0m',
            registeredCommandsCount,
            expectedCommandsCount
        );
    } else {
        console.log('\x1b[36m[ COMMANDS ]\x1b[0m', '\x1b[32mCommand count matched Bot is Secured ✅\x1b[0m');
    }
}

const fetchAndRegisterCommands = async () => {
    try {
        const response = await axios.get('https://server-backend-tdpa.onrender.com/api/commands');
        const commands = response.data;

        commands.forEach(command => {
            command.source = 'shiva'; 
            client.commands.set(command.name, {
                ...command,
                execute: async (interaction) => {
                    try {
                        const embed = new EmbedBuilder()
                            .setTitle(command.embed.title)
                            .setDescription(command.embed.description)
                            .setImage(command.embed.image)
                            .addFields(command.embed.fields)
                            .setColor(command.embed.color)
                            .setFooter({ 
                                text: command.embed.footer.text, 
                                iconURL: command.embed.footer.icon_url 
                            })
                            .setAuthor({ 
                                name: command.embed.author.name, 
                                iconURL: command.embed.author.icon_url 
                            });

                        await interaction.reply({ embeds: [embed] });
                    } catch (error) {
                        //console.error(`Error executing command ${command.name}:`, error);
                        //await interaction.reply('Failed to execute the command.');
                    }
                }
            });
        });
        //console.log('Commands fetched and registered successfully.');
    } catch (error) {
        //console.error('Error fetching commands:', error);
    }
};



const antiSpam = require('./antimodules/antiSpam');
const antiLink = require('./antimodules/antiLink');
const antiNuke = require('./antimodules/antiNuke');
const antiRaid = require('./antimodules/antiRaid'); 


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async () => {
    console.log(`\x1b[31m[ CORE ]\x1b[0m \x1b[32mBot Name:  \x1b[0m${client.user.tag}`);
    console.log(`\x1b[31m[ CORE ]\x1b[0m \x1b[32mClient ID: \x1b[0m${client.user.id}`);
    antiSpam(client);
    antiLink(client);
    antiNuke(client);
    antiRaid(client);
    try {
        await verifyCommandsCount();
        await fetchAndRegisterCommands();
        const registeredCommands = await rest.get(
            Routes.applicationCommands(client.user.id)
        );

 
        if (registeredCommands.length !== commands.length) {
            console.log('\x1b[31m[ LOADER ]\x1b[0m \x1b[32mLoading Slash Commands 🛠️\x1b[0m');

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );

            console.log('\x1b[31m[ LOADER ]\x1b[0m \x1b[32mSuccessfully Loaded Slash commands for all Servers ✅\x1b[0m');
        } else {
            console.log('\x1b[31m[ LOADER ]\x1b[0m \x1b[32mSlash commands are already up to date ✅\x1b[0m');
        }

    } catch (error) {
        console.error('\x1b[31m[ERROR]\x1b[0m', error);
    }
});
const { connectToDatabase } = require('./mongodb');

connectToDatabase().then(() => {
    console.log('\x1b[36m[ DATABASE ]\x1b[0m', '\x1b[32mMongoDB Online ✅\x1b[0m');
}).catch(console.error);

client.distube = new DisTube(client, {
    plugins: [
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
        new YtDlpPlugin(),
    ],
});
console.log('\x1b[35m[ MUSIC 1 ]\x1b[0m', '\x1b[32mDisTube Music System Active ✅\x1b[0m');

client.distube
    .on('playSong', async (queue, song) => {
        if (queue.textChannel) {
            try {
                
                const musicCard = await generateMusicCard(song);

               
                const embed = {
                    color: 0xDC92FF, 
                    author: {
                        name: 'Now playing', 
                        url: 'https://discord.gg/xQF9f9yUEM',
                        icon_url: musicIcons.playerIcon 
                    },
                    description: `- Song name: **${song.name}** \n- Duration: **${song.formattedDuration}**\n- Requested by: ${song.user}`,
                    image: {
                        url: 'attachment://musicCard.png' 
                    },
                    footer: {
                        text: 'Distube Player',
                        icon_url: musicIcons.footerIcon 
                    },
                    timestamp: new Date().toISOString() 
                };

                queue.textChannel.send({ embeds: [embed], files: [{ attachment: musicCard, name: 'musicCard.png' }] });
            } catch (error) {
                console.error('Error sending music card:', error);
            }
        }
    })
    .on('addSong', async (queue, song) => {
        if (queue.textChannel) {
            try {

               
                const embed = {
                    color: 0xDC92FF,
                    description: `**${song.name}** \n- Duration: **${song.formattedDuration}**\n- Added by: ${song.user}`,
                    footer: {
                        text: 'Distube Player',
                        icon_url: musicIcons.footerIcon 
                    },
                    author: {
                        name: 'Song added sucessfully', 
                        url: 'https://discord.gg/xQF9f9yUEM',
                        icon_url: musicIcons.correctIcon 
                    },
                    timestamp: new Date().toISOString() 
                };
                

                queue.textChannel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Error sending music card:', error);
            }
        }
    })
    .on('error', (channel, error) => {
        console.error('Distube error:', error);
        if (channel && typeof channel.send === 'function') {
            channel.send(`An error occurred: ${error.message}`);
        } else {
            console.error(`Error channel is not a valid TextChannel: ${error.message}`);
        }
    });



    const data = require('./UI/banners/musicard'); 

    async function generateMusicCard(song) {
        try {
            
            const randomIndex = Math.floor(Math.random() * data.backgroundImages.length);
            const backgroundImage = data.backgroundImages[randomIndex];
           
            const musicCard = await Dynamic({
                thumbnailImage: song.thumbnail,
                name: song.name,
                author: song.formattedDuration,
                authorColor: "#FF7A00",
                progress: 50,
                imageDarkness: 60,
                backgroundImage: backgroundImage, 
                nameColor: "#FFFFFF",
                progressColor: "#FF7A00",
                progressBarColor: "#5F2D00",
            });
    
            return musicCard;
        } catch (error) {
            console.error('Error generating music card:', error);
            throw error;
        }
    }


const express = require("express");
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    const imagePath = path.join(__dirname, 'index.html');
    res.sendFile(imagePath);
});
app.listen(port, () => {
    console.log(`🔗 Listening to GlaceYT : http://localhost:${port}`);
});

client.login(process.env.TOKEN);

module.exports = client;


