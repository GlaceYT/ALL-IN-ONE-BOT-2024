const client = require('./main');
require('./bot');
require('./shiva');

const loadEventHandlers = () => {
    const colors = require('./UI/colors/colors');

    // Helper function for logging
    const logSystem = (system, status = '✅') => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(
            `${colors.gray}[${timestamp}]${colors.reset}`,
            `${colors.cyan}[${system.padEnd(15)}]${colors.reset}`,
            `${colors.green}${status}${colors.reset}`
        );
    };

    // Clear console and show startup banner
    console.clear();
    
    // Current Date/Time and User Display
    const currentDate = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Fancy header
    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.yellow}${colors.bright}             🤖 BOT SYSTEMS INITIALIZATION 🤖${colors.reset}`);
    console.log('═'.repeat(60) + '\n');

    // Core Systems
    console.log(`\n${colors.magenta}${colors.bright}📡 CORE SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));
    
    // Welcome System
    const guildMemberAddHandler = require('./events/guildMemberAdd');
    guildMemberAddHandler(client);
    logSystem('WELCOME');

    // Ticket System
    const ticketHandler = require('./events/ticketHandler');
    ticketHandler(client);
    logSystem('TICKET');

    // Voice Channel System
    const voiceChannelHandler = require('./events/voiceChannelHandler');
    voiceChannelHandler(client);
    logSystem('VOICE');

    console.log(`\n${colors.magenta}${colors.bright}🎮 ENGAGEMENT SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));

    // Giveaway System
    const giveawayHandler = require('./events/giveaway');
    giveawayHandler(client);
    logSystem('GIVEAWAY');

    // Role Systems
    const autoroleHandler = require('./events/autorole');
    autoroleHandler(client);
    logSystem('AUTOROLE');

    const reactionRoleHandler = require('./events/reactionroles');
    reactionRoleHandler(client);
    logSystem('REACTION ROLES');

    console.log(`\n${colors.magenta}${colors.bright}😀 EMOJI & AFK SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));

    // Emoji Systems
    const nqnHandler = require('./events/nqn');
    nqnHandler(client);
    const emojiHandler = require('./events/emojiHandler');
    emojiHandler(client);
    logSystem('NQN');
    logSystem('EMOJI');
    
    // AFK System
    const afkHandler = require('./events/afkHandler');
    afkHandler(client);
    logSystem('AFK');

    console.log(`\n${colors.magenta}${colors.bright}🔔 NOTIFICATION SYSTEMS${colors.reset}`);
    console.log('─'.repeat(40));

    // Social Media Notifications
    const startYouTubeNotifications = require('./events/youTubeHandler');
    const startTwitchNotifications = require('./events/twitchHandler');
    const startFacebookNotifications = require('./events/facebookHandler');
    const startInstagramNotifications = require('./events/instagramHandler');

    startYouTubeNotifications(client);
    logSystem('YOUTUBE');
    
    startTwitchNotifications(client);
    logSystem('TWITCH');
    
    startFacebookNotifications(client);
    logSystem('FACEBOOK');
    
    startInstagramNotifications(client);
    logSystem('INSTAGRAM');

    // Music System
    console.log(`\n${colors.magenta}${colors.bright}🎵 MUSIC SYSTEM${colors.reset}`);
    console.log('─'.repeat(40));
    require('./events/music')(client);
    logSystem('LAVALINK MUSIC');

    require('./shiva');

    // Footer
    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.green}${colors.bright}             ✨ ALL SYSTEMS INITIALIZED ✨${colors.reset}`);
    console.log('═'.repeat(60) + '\n');

    // Final status
    console.log(`${colors.green}${colors.bright}Status: ${colors.reset}${colors.green}All systems operational${colors.reset}`);
    console.log(`${colors.gray}Last checked: ${colors.reset}${colors.cyan}${new Date().toLocaleTimeString()}${colors.reset}\n`);
};

loadEventHandlers();