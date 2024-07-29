const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rpc',
    description: 'Play a game of Rock, Paper, Scissors with the bot.',
    execute(message, args) {
        // Possible choices
        const choices = ['rock', 'paper', 'scissors'];

        // Randomly select a choice
        const randomIndex = Math.floor(Math.random() * choices.length);
        const randomChoice = choices[randomIndex];

        // Create an embed to display the result
        const embed = new EmbedBuilder()
            .setTitle('Rock, Paper, Scissors')
            .setDescription(`I chose **${randomChoice}**!`)
            .setColor('#00FF00'); // Optional: Set embed color

        // Send the embed as a reply
        message.reply({ embeds: [embed] });
    },
};
