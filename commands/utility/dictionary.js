const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dictionary')
        .setDescription(lang.dictionaryDescription)
        .addStringOption(option =>
            option.setName('word')
                .setDescription('Enter the word to look up')
                .setRequired(true)),

    async execute(interaction) {
        let word;

        if (interaction.isCommand && interaction.isCommand()) {
            word = interaction.options.getString('word');
        } else {
            const args = interaction.content.trim().split(' ');
            args.shift(); 
            word = args.join(' ');
        }

        if (!word) {
            await interaction.reply({ content: lang.dictionaryNoWordProvided, ephemeral: true });
            return;
        }

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = response.data[0]; 

            const embed = new EmbedBuilder()
                .setColor('#4caf50')
                .setTitle(`Dictionary Definition: ${word}`)
                .setDescription(`**Definition:** ${data.meanings[0].definitions[0].definition}\n\n**Example:** ${data.meanings[0].definitions[0].example || 'No example available'}\n\n**Synonyms:** ${data.meanings[0].definitions[0].synonyms ? data.meanings[0].definitions[0].synonyms.join(', ') : 'No synonyms available'}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: lang.dictionaryError, ephemeral: true });
        }
    },
};
