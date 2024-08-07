const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage'); 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription(lang.rollCommandDescription),

    async execute(interaction) {
        try {
            const rollResult = Math.floor(Math.random() * 6) + 1; 
            const embed = new EmbedBuilder()
                .setTitle(lang.rollEmbedTitle)
                .setColor(0xffcc00)
                .setDescription(lang.rollEmbedDescription.replace('{rollResult}', rollResult));

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('An error occurred during command execution:', error);
            await interaction.reply(lang.rollErrorMessage);
        }
    },
};
