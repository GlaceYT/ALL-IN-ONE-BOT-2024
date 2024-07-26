const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'howgay',
    description: 'Calculates your gay rate.',
    execute(message, args) {
        // Generate a random number between 1 and 100
        var result = Math.ceil(Math.random() * 100);

        // Construct the embed using EmbedBuilder
        const embed = new EmbedBuilder()
            .setTitle('🏳️‍🌈 Gay Rate')
            .setDescription(`You are ${result}% gay!`)
            .setColor('#ff69b4'); // Optional: Set embed color

        // Send the embed as a reply
        message.reply({ embeds: [embed] });
    },
};
