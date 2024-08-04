
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ramadan',
    description: 'Displays the number of days until Ramadan.',
    execute(message, args) {
        let today = new Date();
        let ramadan = new Date(today.getFullYear(), 3, 12); // Ramadan is typically in April

        // Check if today is after Ramadan this year
        if (today.getMonth() === 3 && today.getDate() >= 12) {
            ramadan.setFullYear(ramadan.getFullYear() + 1); // Set to next year if already passed
        } else if (today.getMonth() > 3) {
            ramadan.setFullYear(ramadan.getFullYear() + 1); // Set to next year if we're past April
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((ramadan.getTime() - today.getTime()) / one_day);

        // Construct the embed
        const embed = new EmbedBuilder()
            .setTitle('🌙 Ramadan Countdown')
            .setDescription(`${daysLeft} days until Ramadan`);

        // Send the embed as a reply
        message.reply({ embeds: [embed] });
    },
};
