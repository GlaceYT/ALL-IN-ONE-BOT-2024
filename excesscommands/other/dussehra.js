const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dussehra',
    description: 'Displays the number of days until Dussehra.',
    execute(message, args) {
        let today = new Date();
        let dussehra = new Date(today.getFullYear(), 9, 15); // Dussehra is typically in October

        // Check if Dussehra has passed this year, if so, set it to next year
        if (today.getMonth() === 9 && today.getDate() > 15) {
            dussehra.setFullYear(dussehra.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((dussehra.getTime() - today.getTime()) / one_day);

        // Construct the embed using MessageEmbed
        const embed = new EmbedBuilder()
            .setTitle('🏹 Dussehra Countdown')
            .setDescription(`${daysLeft} days until Dussehra`)
            .setColor('#ff9933'); // Optional: Set embed color

        // Send the embed as a reply
        message.reply({ embeds: [embed] });
    },
};
