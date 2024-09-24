const client = require('./main');
require('./bot');
require('./shiva');

const loadEventHandlers = () => {
    console.log('\x1b[36m[ WELCOME ]\x1b[0m', '\x1b[32mWelcome System Active ✅\x1b[0m');
    const guildMemberAddHandler = require('./events/guildMemberAdd');
    guildMemberAddHandler(client);
    console.log('\x1b[36m[ TICKET ]\x1b[0m', '\x1b[32mTicket System Active ✅\x1b[0m');
    const ticketHandler = require('./events/ticketHandler');
    ticketHandler(client);
    console.log('\x1b[36m[ VOICE CHANNEL ]\x1b[0m', '\x1b[32mVoice Channel System Active ✅\x1b[0m');
    const voiceChannelHandler = require('./events/voiceChannelHandler');
    voiceChannelHandler(client);
    console.log('\x1b[36m[ GIVEAWAY ]\x1b[0m', '\x1b[32mGiveaway System Active ✅\x1b[0m');
    const giveawayHandler = require('./events/giveaway');
    giveawayHandler(client);
    console.log('\x1b[36m[ AUTOROLE ]\x1b[0m', '\x1b[32mAutorole System Active ✅\x1b[0m');
    const autoroleHandler = require('./events/autorole');
    autoroleHandler(client);
    console.log('\x1b[36m[ REACTION ROLES ]\x1b[0m', '\x1b[32mReaction Roles System Active ✅\x1b[0m');
    const reactionRoleHandler = require('./events/reactionroles');
    reactionRoleHandler(client);
    const nqnHandler = require('./events/nqn');
    nqnHandler(client);
    const emojiHandler = require('./events/emojiHandler');
    console.log('\x1b[36m[ NQN Module ]\x1b[0m', '\x1b[32mEmoji System Active ✅\x1b[0m');
    emojiHandler(client);
    require('./events/music')(client);
    require('./shiva');
};


loadEventHandlers();


const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { token } = require('./config.json');  // Store your bot token in config.json

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

        await interaction.reply({ embeds: [embed]});
    }
});
