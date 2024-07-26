const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'holi',
    description: 'Displays the number of days until Holi.',
    execute(message, args) {
        let today = new Date();
        let holi = new Date(today.getFullYear(), 2, 29); // Holi is typically in March

        // Check if Holi date is valid for the current year
        if (holi.getMonth() !== 2 || holi.getDate() !== 29) {
            // If February 29th doesn't exist this year, set it to March 1st
            holi = new Date(today.getFullYear(), 2, 1);
        }

        // Check if Holi has passed this year, if so, set it to next year
        if (today.getMonth() > 2 || (today.getMonth() === 2 && today.getDate() > 29)) {
            holi.setFullYear(holi.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((holi.getTime() - today.getTime()) / one_day);

        // Construct the embed using EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle('🎉 Holi Countdown')
            .setDescription(`${daysLeft} days until Holi`)
            .setColor('#ff66b3'); // Optional: Set embed color

        // Send the embed as a reply
        message.reply({ embeds: [embed] });
    },
};
