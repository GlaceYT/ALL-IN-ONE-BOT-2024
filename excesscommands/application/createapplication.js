const { createApplication } = require('../../models/applications');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'createapplication',
    description: 'Create a new application',
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

        if (!appName) {
            const noNameEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Application Creation Failed')
                .setDescription('Please provide a name for the application.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noNameEmbed] });
        }

        const guildId = message.guild.id;
        await createApplication(guildId, appName);

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Application Created')
            .setDescription(`Application **${appName}** created successfully.`)
            .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [successEmbed] });
    },
};
