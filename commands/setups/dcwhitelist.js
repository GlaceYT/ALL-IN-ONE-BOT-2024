const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// Assuming you have an array or object of commands
const commands = [
    // Your other commands
];

// Add the /dcwhitelist command
commands.push(
    new SlashCommandBuilder()
        .setName('dcwhitelist')
        .setDescription('Whitelist a user in the server')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('The user to whitelist')
            .setRequired(true))
        .toJSON()
);

// Register the commands (this may already be part of your bot code)
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),  // Change to applicationCommands if global
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
