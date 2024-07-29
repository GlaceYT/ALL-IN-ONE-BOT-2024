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

       
        if (interaction.isCommand && interaction.isCommand()) {
            word = interaction.options.getString('word');
        } else {
           
            const args = interaction.content.trim().split(' ');
            args.shift(); 
            word = args.join(' ');
        }

       
        if (!word) {
            const errorMessage = 'No word provided. Please provide a word to look up.';
            if (interaction.isCommand && interaction.isCommand()) {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
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

            if (interaction.isCommand && interaction.isCommand()) {
             
                await interaction.reply({ embeds: [embed] });
            } else {
               
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            const errorMessage = 'Failed to fetch dictionary definition. Please try again with other word.';
            if (interaction.isCommand && interaction.isCommand()) {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    },
};
