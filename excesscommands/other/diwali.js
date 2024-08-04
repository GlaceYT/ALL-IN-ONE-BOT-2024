
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'diwali',
    description: 'Displays the number of days until Diwali.',
    execute(message, args) {
        let today = new Date();
        let diwali = new Date(today.getFullYear(), 10, 4); // Diwali is typically in November

        // Check if Diwali has passed this year, if so, set it to next year
        if (today.getMonth() === 10 && today.getDate() > 4) {
            diwali.setFullYear(diwali.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((diwali.getTime() - today.getTime()) / one_day);

        // Construct the embed using EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle('🪔 Diwali Countdown')
            .setDescription(`${daysLeft} days until Diwali`)
            .setColor('#ffcc00'); // Optional: Set embed color

        // Send the embed as a reply
        message.reply({ embeds: [embed] });
    },
};
