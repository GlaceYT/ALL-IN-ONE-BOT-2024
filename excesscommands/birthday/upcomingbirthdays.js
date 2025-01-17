const { getAllBirthdays } = require('../../models/birthday');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment'); 

module.exports = {
    name: 'upcomingbirthdays',
    description: 'Check upcoming birthdays in the next 30 days.',
    async execute(message) {
        const birthdays = await getAllBirthdays();
        const upcomingBirthdays = [];

        const now = moment();

        birthdays.forEach(({ userId, birthday }) => {
            const [month, day] = birthday.split('-');
            const birthdayDate = moment(`${now.year()}-${month}-${day}`, 'YYYY-MM-DD');

            if (birthdayDate.isBefore(now)) {
                birthdayDate.add(1, 'year');
            }

            if (birthdayDate.diff(now, 'days') <= 30) {
                upcomingBirthdays.push({
                    userId,
                    birthday,
                    daysUntil: birthdayDate.diff(now, 'days'),
                });
            }
        });

        if (upcomingBirthdays.length === 0) {
            const noUpcomingEmbed = new EmbedBuilder()
                .setTitle('No Upcoming Birthdays')
                .setDescription('No upcoming birthdays in the next 30 days.')
                .setColor('#FF0000')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noUpcomingEmbed] });
        }

        const embed = new EmbedBuilder()
            .setTitle('Upcoming Birthdays')
            .setColor('#FFD700')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        for (const { userId, birthday, daysUntil } of upcomingBirthdays) {
            const user = await message.client.users.fetch(userId);
            embed.addFields({ name: user.username, value: `${birthday} (${daysUntil} days)` });
        }

        message.reply({ embeds: [embed] });
    },
};
