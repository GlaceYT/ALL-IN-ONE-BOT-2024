const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// Define your commands array
const commands = [
    new SlashCommandBuilder()
        .setName('dcwhitelist')
        .setDescription('Whitelist a user in the server')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to whitelist')
            .setRequired(true))
        .toJSON()
];

// Initialize REST API with bot token
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Deploy global commands (without needing GUILD_ID or CLIENT_ID)
(async () => {
    try {
        console.log('Started refreshing global application (/) commands.');

        // Register global commands
        await rest.put(
            Routes.applicationCommands(), // Registers global commands
            { body: commands }
        );

        console.log('Successfully reloaded global application (/) commands.');
    } catch (error) {
        console.error('Error reloading commands:', error);
    }
})();
