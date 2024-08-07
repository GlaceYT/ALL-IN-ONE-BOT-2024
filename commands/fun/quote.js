
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription(lang.quoteCommandDescription),

    async execute(interaction) {
        const { quoteFallbackText, quoteFallbackAuthor, quoteTitle, quoteFallbackTitle } = lang;
        const apiUrl = 'https://type.fit/api/quotes';
        const fallbackQuote = {
            text: quoteFallbackText,
            author: quoteFallbackAuthor
        };

        try {
            const response = await fetch(apiUrl);
            const quotes = await response.json();
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(quoteTitle)
                .setDescription(`**"${randomQuote.text}"**\n\n— *${randomQuote.author || 'Unknown'}*`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching quote:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(quoteFallbackTitle)
                .setDescription(`**"${fallbackQuote.text}"**\n\n— *${fallbackQuote.author}*`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    async executePrefix(message) {
        const { quoteFallbackText, quoteFallbackAuthor, quoteTitle, quoteFallbackTitle } = lang;
        const apiUrl = 'https://type.fit/api/quotes';
        const fallbackQuote = {
            text: quoteFallbackText,
            author: quoteFallbackAuthor
        };

        try {
            const response = await fetch(apiUrl);
            const quotes = await response.json();
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(quoteTitle)
                .setDescription(`**"${randomQuote.text}"**\n\n— *${randomQuote.author || 'Unknown'}*`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching quote:', error);
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(quoteFallbackTitle)
                .setDescription(`**"${fallbackQuote.text}"**\n\n— *${fallbackQuote.author}*`)
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        }
    },
};
