const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a random quote'),

    async execute(interaction) {
        const apiUrl = 'https://type.fit/api/quotes';
        const fallbackQuote = {
            text: "To be, or not to be, that is the question.",
            author: "William Shakespeare"
        };

        try {
            const response = await fetch(apiUrl);
            const quotes = await response.json();
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Random Quote')
                .setDescription(`**"${randomQuote.text}"**\n\n— *${randomQuote.author || 'Unknown'}*`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching quote:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Random Quote (Fallback)')
                .setDescription(`**"${fallbackQuote.text}"**\n\n— *${fallbackQuote.author}*`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    async executePrefix(message) {
        const apiUrl = 'https://type.fit/api/quotes';
        const fallbackQuote = {
            text: "To be, or not to be, that is the question.",
            author: "William Shakespeare"
        };

        try {
            const response = await fetch(apiUrl);
            const quotes = await response.json();
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Random Quote')
                .setDescription(`**"${randomQuote.text}"**\n\n— *${randomQuote.author || 'Unknown'}*`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching quote:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Random Quote (Fallback)')
                .setDescription(`**"${fallbackQuote.text}"**\n\n— *${fallbackQuote.author}*`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        }
    },
};
