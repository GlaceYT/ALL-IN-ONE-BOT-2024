const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'christmas',
    description: 'Displays the number of days until Christmas.',
    execute(message, args) {
        let today = new Date();
        let xmas = new Date(today.getFullYear(), 11, 25); // Christmas is on December 25th

        // Check if Christmas has passed this year, if so, set it to next year
        if (today.getMonth() === 11 && today.getDate() > 25) {
            xmas.setFullYear(xmas.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((xmas.getTime() - today.getTime()) / one_day);

        // Construct the embed using EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle('🎄 Christmas Countdown')
            .setDescription(`${daysLeft} days until Christmas`)
            .setColor('#ff0000'); // Optional: Set embed color

        // Send the embed as a reply
        message.reply({ embeds: [embed] });
    },
};
