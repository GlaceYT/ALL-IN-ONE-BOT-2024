const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage'); // Adjust the path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomnum')
        .setDescription(lang.randomnumCommandDescription)
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
            return interaction.reply({ content: lang.randomnumError, ephemeral: true });
        }

        if (min > max) {
            [min, max] = [max, min];
        }

        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        const embed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle(lang.randomnumTitle)
            .setDescription(lang.randomnumDescription
                .replace('{min}', min)
                .replace('{max}', max)
                .replace('{randomNumber}', randomNumber))
            .setTimestamp();

        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    },
};
