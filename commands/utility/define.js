const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription(lang.defineDescription)
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to define')
                .setRequired(true)),

    async execute(interaction) {
        
        const isSlashCommand = interaction.isCommand && interaction.isCommand();

        const word = isSlashCommand ? interaction.options.getString('word') : interaction.content.split(' ').slice(1).join(' ');

        if (!word.trim()) {
            await interaction.reply({ content: lang.defineNoWordProvided, ephemeral: true });
            return;
        }

        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.title === "No Definitions Found") {
                await interaction.reply(lang.defineNoDefinitionFound.replace('{{word}}', word));
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
            await interaction.reply(lang.defineError);
        }
    },
};
