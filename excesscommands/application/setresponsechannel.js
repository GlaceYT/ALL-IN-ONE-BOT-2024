const { getApplication, activateApplication } = require('../../models/applications');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'setresponsechannel',
    description: 'Set the response channel for application reviews',
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
        
        if (args.length < 2) {
            const usageEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Usage')
                .setDescription('Usage: !setresponsechannel <appName> <channel>')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [usageEmbed] });
        }

        const appName = args[0];
        const channelId = args[1]?.replace(/[<#>]/g, '');

        const channel = message.guild.channels.cache.get(channelId);
        if (!channel) {
            const invalidChannelEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Invalid Channel')
                .setDescription('Invalid channel provided. Please mention a valid channel.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [invalidChannelEmbed] });
        }

        const guildId = message.guild.id;
        const app = await getApplication(guildId, appName);

        if (!app) {
            const appNotFoundEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Application Not Found')
                .setDescription('Application not found.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [appNotFoundEmbed] });
        }

        await activateApplication(guildId, appName, app.mainChannel, channel.id);

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Response Channel Set')
            .setDescription(`Response channel for **${appName}** set to ${channel}.`)
            .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [successEmbed] });
    },
};
