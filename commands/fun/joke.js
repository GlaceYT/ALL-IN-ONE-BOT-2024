const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const giveMeAJoke = require('give-me-a-joke');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Get a random joke'),
    async execute(interaction) {
        try {
            // Get a random joke
            giveMeAJoke.getRandomDadJoke(function(joke) {
                const embed = new EmbedBuilder()
                    .setColor(0xffcc00)
                    .setTitle('Random Joke')
                    .setDescription(joke);

                // Reply with the joke
                interaction.reply({ embeds: [embed] });
            });
        } catch (error) {
            console.error('An error occurred during command execution:', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    },
};
