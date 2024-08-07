const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription(lang.factDescription),

    async execute(interaction) {
        const apiUrl = 'https://uselessfacts.jsph.pl/random.json?language=en';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(lang.factTitle)
                .setDescription(data.text)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching fact:', error);
            await interaction.reply(lang.factError);
        }
    },

    async executePrefix(message) {
        const apiUrl = 'https://uselessfacts.jsph.pl/random.json?language=en';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(lang.factTitle)
                .setDescription(data.text)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching fact:', error);
            await message.channel.send(lang.factError);
        }
    },
};
