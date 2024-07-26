const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription('Look up the definition of a word')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('Enter the word to look up')
                .setRequired(true)),

    async execute(interaction) {
        let word;

        // Check if interaction is a slash command
        if (interaction.isCommand && interaction.isCommand()) {
            word = interaction.options.getString('word');
        } else {
            // Assume it's a prefix command
            const args = interaction.content.trim().split(' ');
            args.shift(); // Remove the command name
            word = args.join(' ');
        }

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = response.data[0]; // Assuming the API returns data in this structure

            const embed = new EmbedBuilder()
                .setColor('#4caf50')
                .setTitle(`Dictionary Definition: ${word}`)
                .setDescription(`**Definition:** ${data.meanings[0].definitions[0].definition}\n\n**Example:** ${data.meanings[0].definitions[0].example || 'No example available'}\n\n**Synonyms:** ${data.meanings[0].definitions[0].synonyms ? data.meanings[0].definitions[0].synonyms.join(', ') : 'No synonyms available'}`)
                .setTimestamp();

            if (interaction.isCommand && interaction.isCommand()) {
                // Reply to slash command interaction
                await interaction.reply({ embeds: [embed] });
            } else {
                // Reply to prefix command interaction
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            if (interaction.isCommand && interaction.isCommand()) {
                await interaction.reply('Failed to fetch dictionary definition. Please try again later.');
            } else {
                await interaction.channel.send('Failed to fetch dictionary definition. Please try again later.');
            }
        }
    },
};
