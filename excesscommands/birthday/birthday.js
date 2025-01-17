const { getBirthday } = require('../../models/birthday');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'birthday',
    description: 'Check your birthday or someone else\'s.',
    async execute(message, args) {
        let user = message.mentions.users.first() || message.author;
        const userId = user.id;

        const birthdayProfile = await getBirthday(userId);

        if (!birthdayProfile) {
            const noBirthdayEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Birthday Not Set')
                .setDescription(`${user.username} has not set their birthday.`)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noBirthdayEmbed] });
        }

        const birthdayEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s Birthday`)
            .setDescription(`**${user.username}**'s birthday is on **${birthdayProfile.birthday}**.`)
            .setColor('#FFD700')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [birthdayEmbed] });
    },
};
