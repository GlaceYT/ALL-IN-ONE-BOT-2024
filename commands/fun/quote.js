const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a random quote'),
    async execute(interaction) {
        const apiUrl = 'https://api.quotable.io/random';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Random Quote')
                .setDescription(`**"${data.content}"**\n\n— *${data.author}*`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching quote:', error);
            await interaction.reply('An error occurred while fetching the quote.');
        }
    },
    async executePrefix(message) {
        const apiUrl = 'https://api.quotable.io/random';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Random Quote')
                .setDescription(`**"${data.content}"**\n\n— *${data.author}*`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching quote:', error);
            await message.channel.send('An error occurred while fetching the quote.');
        }
    },
};
