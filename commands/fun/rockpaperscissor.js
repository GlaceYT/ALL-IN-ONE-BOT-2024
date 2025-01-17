const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage'); // Adjust the path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rockpaperscissor')
        .setDescription(lang.rockPaperScissorsCommandDescription)
        .addStringOption(option =>
            option.setName('choice')
                .setDescription(lang.rockPaperScissorsChoiceDescription)
                .setRequired(true)),
    
    async execute(interaction) {
        let userChoice;
        let botChoice;
        let result;

        if (interaction.isCommand && interaction.isCommand()) {
            userChoice = interaction.options.getString('choice').toLowerCase();
        } else {
            const message = interaction;
            userChoice = message.content.split(' ').slice(1).join(' ').toLowerCase();
        }

        const choices = ['rock', 'paper', 'scissors'];
        botChoice = choices[Math.floor(Math.random() * choices.length)];

        if (!choices.includes(userChoice)) {
            return interaction.reply(lang.rockPaperScissorsInvalidChoice);
        }

        if (userChoice === botChoice) {
            result = lang.rockPaperScissorsTie;
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = lang.rockPaperScissorsWin;
        } else {
            result = lang.rockPaperScissorsLose;
        }

        const embed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle(lang.rockPaperScissorsTitle)
            .setDescription(lang.rockPaperScissorsResult
                .replace('{userChoice}', userChoice)
                .replace('{botChoice}', botChoice)
                .replace('{result}', result))
            .setTimestamp();

        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    },
};
