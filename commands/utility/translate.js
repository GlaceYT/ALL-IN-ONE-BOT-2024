const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const apiKey = 'AIzaSyBuif-wNw_Eov5TESRW15qEsn3buSdrxqc'; // Replace with your actual API key

// Function to fetch translation using Google Translate API
async function translateText(text, targetLanguage) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const requestBody = {
        q: text,
        target: targetLanguage,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch translation');
        }

        const data = await response.json();
        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        return 'Failed to translate text. Please try again.';
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translates text to a specified language')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to translate')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Target language for translation (e.g., en, fr, de)')
                .setRequired(true)),

    async execute(interaction) {
        let textToTranslate, targetLanguage;

        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            textToTranslate = interaction.options.getString('text');
            targetLanguage = interaction.options.getString('language');
        } else {
            // Prefix command execution
            const args = interaction.content.split(' ');
            args.shift(); // Remove the command name
            textToTranslate = args.slice(0, -1).join(' '); // Join all except last argument
            targetLanguage = args[args.length - 1]; // Last argument is the target language
        }

        try {
            const translatedText = await translateText(textToTranslate, targetLanguage);

            // Create a new embed with the translation results
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Translation Result')
                .setDescription(`**Original Text:** ${textToTranslate}\n**Translated Text (${targetLanguage}):** ${translatedText}`)
                .setTimestamp();

            // Reply with the embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing translate command:', error);

            // Reply with an error message
            await interaction.reply('Failed to translate text. Please try again.');
        }
    },
};
