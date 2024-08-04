const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomnum')
        .setDescription('Generates a random number within a specified range')
        .addIntegerOption(option =>
            option.setName('min')
                .setDescription('Minimum value (inclusive)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('max')
                .setDescription('Maximum value (inclusive)')
                .setRequired(true)),

    async execute(interaction) {
        let min, max;

     
        if (interaction.isCommand && interaction.isCommand()) {
            min = interaction.options.getInteger('min');
            max = interaction.options.getInteger('max');
        } else {
     
            const args = interaction.content.trim().split(/ +/);
            min = parseInt(args[1]);
            max = parseInt(args[2]);
        }

        if (isNaN(min) || isNaN(max)) {
            return interaction.reply('Please provide valid numbers for min and max values.');
        }

    
        if (min > max) {
            [min, max] = [max, min];
        }

        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('Random Number Generator')
            .setDescription(`Generated a random number between **${min}** and **${max}**: **${randomNumber}**`)
            .setTimestamp();

    
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    },
};
