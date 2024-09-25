const { Client, Intents, EmbedBuilder } = require('discord.js');
require('dotenv').config(); // This will load environment variables from .env or the hosting service

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'dcwhitelist') {
        // Embed creation, customize as needed
        const embed = new EmbedBuilder()
            .setTitle('WHITELIST RESULT')
            .setDescription(`Congratulations, <@${interaction.user.id}>! You are Whitelisted!\n\nMake sure to check \`#📜\` for the server IP and put your In-Game Name Here \`#No Access\`\n\nEnjoy roleplay`)
            .setColor(0x00FF00)
            .setFooter({ text: `Whitelisted BY: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        // Send the embed in the channel
        await interaction.reply({ embeds: [embed] });
    }
});

// Start the bot with the token from environment variables
client.login(process.env.DISCORD_TOKEN);

