const { updateXp } = require('../../models/users');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'givexp',
    description: 'Give XP to a user.',
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
            await updateXp(user.id, xpAmount);

            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('XP Given')
                .setDescription(`Gave ${xpAmount} XP to ${user}.`)
                .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);

            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('There was an error giving XP.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
