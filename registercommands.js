const { REST, Routes } = require('discord.js');
require('dotenv').config();  // Load environment variables from .env or hosting

const commands = [
    {
        name: 'dcwhitelist',
        description: 'Displays whitelist result',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
