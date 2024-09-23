const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { token, clientId, guildId } = require('./config.json');  // Make sure to store your token and IDs in a config file

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
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
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
