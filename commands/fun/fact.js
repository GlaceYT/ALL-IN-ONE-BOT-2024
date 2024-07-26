const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random fact'),
    async execute(interaction) {
        const apiUrl = 'https://uselessfacts.jsph.pl/random.json?language=en';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Random Fact')
                .setDescription(data.text)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching fact:', error);
            await interaction.reply('An error occurred while fetching the fact.');
        }
    },
    async executePrefix(message) {
        const apiUrl = 'https://uselessfacts.jsph.pl/random.json?language=en';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Random Fact')
                .setDescription(data.text)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching fact:', error);
            await message.channel.send('An error occurred while fetching the fact.');
        }
    },
};
