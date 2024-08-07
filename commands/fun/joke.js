const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const giveMeAJoke = require('give-me-a-joke');
const lang = require('../../events/loadLanguage'); // Adjust the path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription(lang.jokeCommandDescription),
    async execute(interaction) {
        const { jokeEmbedTitle, jokeError } = lang;

        try {
            // Get a random joke and send it as an embed
            giveMeAJoke.getRandomDadJoke((joke) => {
                const embed = new EmbedBuilder()
                    .setColor(0xffcc00)
                    .setTitle(jokeEmbedTitle)
                    .setDescription(joke);

                // Reply with the joke embed
                interaction.reply({ embeds: [embed] });
            });
        } catch (error) {
            console.error('An error occurred during command execution:', error);
            await interaction.reply({ content: jokeError, ephemeral: true });
        }
    },
};
