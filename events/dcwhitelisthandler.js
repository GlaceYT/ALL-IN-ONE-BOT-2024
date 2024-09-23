const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { token } = require('./config.json');  // Only need the token now

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Register the slash command
const commands = [
    new SlashCommandBuilder()
        .setName('dcwhitelist')
        .setDescription('Whitelist a user in the server')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to whitelist')
            .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing global application (/) commands.');

        // Use global commands registration
        await rest.put(
            Routes.applicationCommands(),  // Register global commands
            { body: commands },
        );

        console.log('Successfully reloaded global application (/) commands.');
    } catch (error) {
        console.error('Error refreshing commands:', error);
    }
})();

// When the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Handling the command
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'dcwhitelist') {
        const user = options.getUser('target');

        const embed = {
            color: 0x00FF00,  // Green color
            title: 'WHITELIST RESULT',
            description: `Congratulations, ${user}! You are Whitelisted!`,
            fields: [
                {
                    name: 'Next Steps',
                    value: `Make sure to check #SERVER-IP for the server IP and put your in-game name here.`
                },
                {
                    name: 'Enjoy Roleplay',
                    value: 'Have fun!'
                }
            ],
            footer: {
                text: `Whitelisted BY: ${interaction.user.tag}`
            },
            timestamp: new Date()
        };

        await interaction.reply({ embeds: [embed] });
    }
});

// Log in to Discord with your bot's token
client.login(token);
