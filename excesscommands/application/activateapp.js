const { activateApplication, getApplication } = require('../../models/applications');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'activateapp',
    description: 'Activate an application',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Permission Denied')
                .setDescription('You do not have permission to use this command.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }
        const appName = args.join(' ');
        if (!appName) return message.reply('Please provide the name of the application to activate.');
        
        const guildId = message.guild.id;

     
        const app = await getApplication(guildId, appName);
        if (!app) return message.reply('Application not found.');
        
        if (!app.mainChannel || !app.responseChannel) {
            return message.reply('Please set the main and response channels first using !setmainchannel and !setresponsechannel.');
        }
        
       
        await activateApplication(guildId, appName, app.mainChannel, app.responseChannel);
        
    
        const embed = new EmbedBuilder()
            .setDescription(`Application : **${appName}**\n\n- Click the button below to fill out the application.\n- Make sure to provide accurate information.\n- Your responses will be reviewed by the moderators.\n\n- For any questions, please contact support.`)
    .setColor('Blue')
    .setAuthor({ name: 'Welcome To Our Application System', iconURL: 'https://cdn.discordapp.com/emojis/1052751247582699621.gif' }) 
    .setFooter({ text: 'Thank you for your interest!', iconURL: 'https://cdn.discordapp.com/emojis/798605720626003968.gif' }); 

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('open_application_modal')
                .setLabel('Apply Now')
                .setStyle(ButtonStyle.Primary)
        );

        const mainChannel = message.guild.channels.cache.get(app.mainChannel);
        if (mainChannel) {
            mainChannel.send({ embeds: [embed], components: [button] });
        } else {
            return message.reply('The main channel for this application could not be found.');
        }

        message.channel.send(`Application **${appName}** is now active.`);
    },
};
