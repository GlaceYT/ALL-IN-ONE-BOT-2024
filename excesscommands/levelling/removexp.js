const { updateXp, getUserData } = require('../../models/users');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'removexp',
    description: 'Remove XP from a user.',
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

        const user = message.mentions.users.first();
        const xpAmount = parseInt(args[1], 10);

        if (!user || isNaN(xpAmount) || xpAmount <= 0) {
            const invalidArgsEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Invalid Arguments')
                .setDescription('Please mention a valid user and provide a positive amount of XP.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [invalidArgsEmbed] });
        }

        try {
            const userData = await getUserData(user.id);
            if (!userData) {
                const userNotFoundEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('User Not Found')
                    .setDescription('User not found in the database.')
                    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                    .setTimestamp();

                return message.reply({ embeds: [userNotFoundEmbed] });
            }

            await updateXp(user.id, -xpAmount);

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('XP Removed')
                .setDescription(`Removed ${xpAmount} XP from ${user}.`)
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);

            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('There was an error removing XP.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
