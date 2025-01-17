const { clearReports } = require('../../models/reports');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'clearreports',
    description: 'Clears all reports for a specified user',
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
        const userToClear = message.mentions.users.first();

        if (!userToClear) {
            const noUserEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('No User Mentioned')
                .setDescription('Please mention a user to clear their reports.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.channel.send({ embeds: [noUserEmbed] });
        }

        try {
            await clearReports(userToClear.id);

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('Reports Cleared')
                .setDescription(`All reports for ${userToClear.tag} have been cleared.`)
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('There was an error clearing the reports.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [errorEmbed] });
            console.error(error);
        }
    },
};
