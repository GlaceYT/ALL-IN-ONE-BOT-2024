const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Get the definition of a word')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to define')
                .setRequired(true)),
    async execute(interaction) {
        const word = interaction.isCommand ? interaction.options.getString('word') : interaction.content.split(' ').slice(1).join(' ');
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.title === "No Definitions Found") {
                await interaction.reply(`No definition found for "${word}".`);
                return;
            }

            const definitionData = data[0];
            const phonetic = definitionData.phonetic || 'N/A';
            const meanings = definitionData.meanings.map(meaning => ({
                partOfSpeech: meaning.partOfSpeech,
                definitions: meaning.definitions.slice(0, 2).map(def => ({
                    definition: def.definition,
                    example: def.example || 'No example available.'
                }))
            }));

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Definition of ${word}`)
                .setDescription(`**Phonetic:** ${phonetic}`)
                .setTimestamp();

            meanings.forEach(meaning => {
                embed.addFields({
                    name: `Part of Speech: ${meaning.partOfSpeech}`,
                    value: meaning.definitions.map(def => `**Definition:** ${def.definition}\n**Example:** ${def.example}`).join('\n\n')
                });
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching definition:', error);
            await interaction.reply('An error occurred while fetching the definition.');
        }
    },
};
