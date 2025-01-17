const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const giveMeAJoke = require('give-me-a-joke');
const lang = require('../../events/loadLanguage'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription(lang.jokeCommandDescription),
    async execute(interaction) {
        const { jokeEmbedTitle, jokeError } = lang;

        try {
      
            giveMeAJoke.getRandomDadJoke((joke) => {
                const embed = new EmbedBuilder()
                    .setColor(0xffcc00)
                    .setTitle(jokeEmbedTitle)
                    .setDescription(joke);

                
                interaction.reply({ embeds: [embed] });
            });
        } catch (error) {
            console.error('An error occurred during command execution:', error);
            await interaction.reply({ content: jokeError, ephemeral: true });
        }
    },
};
