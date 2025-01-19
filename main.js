const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const axios = require('axios');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { Dynamic } = require('musicard');
const config = require('./config.json');
const musicIcons = require('./UI/icons/musicicons');
const colors = require('./UI/colors/colors');
const loadLogHandlers = require('./logHandlers');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a) => {
      return GatewayIntentBits[a];
    }),
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

// Filter command folders based on config
const enabledCommandFolders = commandFolders.filter(folder => config.categories[folder]);

let totalCommands = 0;

const commands = [];

const maxWidth = 45;

console.log(`${colors.yellow}┌${'─'.repeat(maxWidth)}┐${colors.reset}`);

for (const folder of enabledCommandFolders) {
    const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
    const numCommands = commandFiles.length;

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, folder, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }

    const folderName = `${colors.cyan}${folder}${colors.reset}`;
    const commandCount = `${colors.green}[${numCommands}]${colors.reset}`;
    const dotsCount = maxWidth - folder.length - numCommands.toString().length - 4;
    const dots = `${colors.dim}${'.'.repeat(dotsCount)}${colors.reset}`;

    console.log(`${colors.yellow}│${colors.reset} ${folderName}${dots}${commandCount} ${colors.yellow}│${colors.reset}`);
    totalCommands += numCommands;
}

console.log(`${colors.yellow}├${'─'.repeat(maxWidth)}┤${colors.reset}`);


const totalLine = `Total Commands`;
const dotsCount = maxWidth - totalLine.length - totalCommands.toString().length - 4;
const dots = `${colors.dim}${'.'.repeat(dotsCount)}${colors.reset}`;
console.log(`${colors.yellow}│${colors.reset} ${colors.bright}${totalLine}${colors.reset}${dots}${colors.magenta}[${totalCommands}]${colors.reset} ${colors.yellow}│${colors.reset}`);

console.log(`${colors.yellow}└${'─'.repeat(maxWidth)}┘${colors.reset}\n`);


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
   
    console.log('\n' + '─'.repeat(60));
    console.log(`${colors.yellow}${colors.bright}             🔍 VERIFICATION 🔍${colors.reset}`);
    console.log('─'.repeat(60));

    const expectedCommandsCount = await fetchExpectedCommandsCount();
    const registeredCommandsCount = client.commands.size;

   
    if (expectedCommandsCount === -1) {
        console.log(`${colors.yellow}[ WARNING ]${colors.reset} ${colors.red}Server Status: OFFLINE ❌${colors.reset}`);
        console.log(`${colors.yellow}[ WARNING ]${colors.reset} ${colors.red}Unable to verify commands${colors.reset}`);
        return;
    }

    
    if (registeredCommandsCount !== expectedCommandsCount) {
        console.log(`${colors.yellow}[ WARNING ]${colors.reset} ${colors.red}Commands Mismatch Detected ⚠️${colors.reset}`);
        console.log(`${colors.yellow}[ DETAILS ]${colors.reset} ${colors.red}Current Commands: ${colors.reset}${registeredCommandsCount}`);
        console.log(`${colors.yellow}[ DETAILS ]${colors.reset} ${colors.red}Expected Commands: ${colors.reset}${expectedCommandsCount}`);
        console.log(`${colors.yellow}[ STATUS  ]${colors.reset} ${colors.red}Action Required: Please verify command integrity${colors.reset}`);
    } else {
        console.log(`${colors.cyan}[ COMMANDS ]${colors.reset} ${colors.green}Command Count: ${registeredCommandsCount} ✓${colors.reset}`);
        console.log(`${colors.cyan}[ SECURITY ]${colors.reset} ${colors.green}Command Integrity Verified ✅${colors.reset}`);
        console.log(`${colors.cyan}[ STATUS   ]${colors.reset} ${colors.green}Bot is Secured and Ready 🛡️${colors.reset}`);
    }

    // Footer
    console.log('─'.repeat(60));
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



const rest = new REST({ version: '10' }).setToken(process.env.TOKEN || config.token);

client.once('ready', async () => {
    console.log('\n' + '─'.repeat(40));
    console.log(`${colors.magenta}${colors.bright}👾  BOT INFORMATION${colors.reset}`);
    console.log('─'.repeat(40));
    console.log(`${colors.red}[ CORE ]${colors.reset} ${colors.green}Bot Name:  ${colors.reset}${client.user.tag}`);
    console.log(`${colors.red}[ CORE ]${colors.reset} ${colors.green}Client ID: ${colors.reset}${client.user.id}`);

    console.log('\n' + '─'.repeat(40));
    console.log(`${colors.red}${colors.bright}🛡️  SECURITY SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));

    antiSpam(client);
    antiLink(client);
    antiNuke(client);
    antiRaid(client);
    loadLogHandlers(client);

    try {
        await verifyCommandsCount();
        await fetchAndRegisterCommands();
        const registeredCommands = await rest.get(
            Routes.applicationCommands(client.user.id)
        );

        console.log('\n' + '─'.repeat(40));
        console.log(`${colors.yellow}${colors.bright}⚡ SLASH COMMANDS${colors.reset}`);
        console.log('─'.repeat(40));

        if (registeredCommands.length !== commands.length) {
            console.log(`${colors.red}[ LOADER ]${colors.reset} ${colors.green}Loading Slash Commands 🛠️${colors.reset}`);

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );

            console.log(`${colors.red}[ LOADER ]${colors.reset} ${colors.green}Successfully Loaded Slash Commands ✅${colors.reset}`);
        } else {
            console.log(`${colors.red}[ LOADER ]${colors.reset} ${colors.green}Slash Commands Up To Date ✅${colors.reset}`);
        }

    } catch (error) {
        console.log(`${colors.red}[ ERROR ]${colors.reset} ${colors.red}${error}${colors.reset}`);
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


    const { getActiveApplication } = require('./models/applications'); 

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton() && interaction.customId === 'open_application_modal') {
            const app = await getActiveApplication(interaction.guild.id);
            if (!app) return interaction.reply({ content: 'Active application not found for this server.', ephemeral: true });
    
            const modal = new ModalBuilder()
                .setCustomId('application_form')
                .setTitle('Application Form');
    
            app.questions.forEach((question, index) => {
                const textInput = new TextInputBuilder()
                    .setCustomId(`question_${index}`)
                    .setLabel(question)
                    .setStyle(TextInputStyle.Short);
    
                modal.addComponents(new ActionRowBuilder().addComponents(textInput));
            });
    
            await interaction.showModal(modal);
        } else if (interaction.isModalSubmit() && interaction.customId === 'application_form') {
            const app = await getActiveApplication(interaction.guild.id);
            if (!app) return interaction.reply({ content: 'Active application not found for this server.', ephemeral: true });
    
            const answers = app.questions.map((_, index) => interaction.fields.getTextInputValue(`question_${index}`));
            const responseChannel = interaction.guild.channels.cache.get(app.responseChannel);
    
            if (!responseChannel) {
                return interaction.reply({ content: 'Response channel not found.', ephemeral: true });
            }
    
            const embed = new EmbedBuilder()
                .setTitle('New Application Submission')
                .setDescription(answers.map((answer, index) => `**Q${index + 1}**: ${answer}`).join('\n'))
                .setColor('Blue')
                .setFooter({ text: `Submitted by: ${interaction.user.id}` });
    
            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('accept_application').setLabel('Accept').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('deny_application').setLabel('Deny').setStyle(ButtonStyle.Danger)
            );
    
            await responseChannel.send({ embeds: [embed], components: [buttons] });
            interaction.reply({ content: 'Your application has been submitted!', ephemeral: true });
        } else if (interaction.isButton() && (interaction.customId === 'accept_application' || interaction.customId === 'deny_application')) {
           
            await interaction.deferReply({ ephemeral: true });
    
            const embed = interaction.message.embeds[0];
            const userId = embed.footer?.text.split('Submitted by: ')[1]; 
    
            if (!userId) {
                return interaction.followUp({ content: 'Could not find the user who submitted the application.', ephemeral: true });
            }
    
            const status = interaction.customId === 'accept_application' ? 'accepted' : 'denied';
            const color = status === 'accepted' ? 'Green' : 'Red';
    
      
            const updatedEmbed = EmbedBuilder.from(embed)
                .setColor(color);
    
            await interaction.editReply({ embeds: [updatedEmbed], components: [] });
    
            try {
                const user = await interaction.guild.members.fetch(userId);
                const dmEmbed = new EmbedBuilder()
                    .setTitle(`Your Application Has Been ${status.charAt(0).toUpperCase() + status.slice(1)}`)
                    .setDescription(`Your application to **${interaction.guild.name}** has been **${status}**.`)
                    .addFields(
                        { name: 'Decision Time', value: new Date().toLocaleString(), inline: true },
                        { name: 'Status', value: status.charAt(0).toUpperCase() + status.slice(1), inline: true }
                    )
                    .setColor(color);
    
                await user.send({ embeds: [dmEmbed] });
                interaction.followUp({ content: `The user has been notified that their application was ${status}.`, ephemeral: true });
            } catch (error) {
                interaction.followUp({ content: `Failed to send a DM to the user.`, ephemeral: true });
            }
        }
    });
    
    const cron = require('node-cron');
    const { getEconomyProfile, updateBills, handleEviction, updateWallet } = require('./models/economy');
    const economyCollection = require('./mongodb');
    
    
    async function checkAndProcessBills() {
        const allProfiles = await economyCollection.find({}).toArray();
    
        for (const profile of allProfiles) {
            const userId = profile.userId;
            const user = await client.users.fetch(userId);
            
            const now = Date.now();
            const overdueRent = profile.bills.unpaidRent > 0 && now > profile.bills.rentDueDate;
            const overdueUtilities = profile.bills.unpaidUtilities > 0 && now > profile.bills.utilitiesDueDate;
    
        
            const totalOverdue = overdueRent ? profile.bills.unpaidRent : 0;
            if (overdueRent || overdueUtilities) {
               
                const embed = new EmbedBuilder()
                    .setTitle('Overdue Bills Warning')
                    .setDescription(`You have overdue bills. Total Due: $${totalOverdue}. Please pay to avoid eviction.`)
                    .setColor('#FFA500');
                user.send({ embeds: [embed] });
    
                if (now - profile.bills.rentDueDate > 7 * 24 * 60 * 60 * 1000) { 
                  
                    if (profile.wallet >= totalOverdue) {
                        await updateWallet(userId, -totalOverdue);
                        await updateBills(userId, { unpaidRent: 0, rentDueDate: now + 30 * 24 * 60 * 60 * 1000 });
                        
                        const paymentEmbed = new EmbedBuilder()
                            .setTitle('Bills Paid Automatically')
                            .setDescription(`We have deducted $${totalOverdue} from your wallet to cover overdue bills.`)
                            .setColor('#00FF00');
                        user.send({ embeds: [paymentEmbed] });
                    } else {
                        await handleEviction(userId);
                        const evictionEmbed = new EmbedBuilder()
                            .setTitle('Eviction Notice')
                            .setDescription('You have been evicted due to unpaid bills.')
                            .setColor('#FF0000');
                        user.send({ embeds: [evictionEmbed] });
                    }
                }
            }
        }
    }
    
    
    cron.schedule('0 0 * * *', () => {
        console.log('Running daily bill check...');
        checkAndProcessBills();
    });

    
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

client.login(process.env.TOKEN || config.token);

module.exports = client;
