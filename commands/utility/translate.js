const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const lang = require('../../events/loadLanguage');
const apiKey = 'AIzaSyBuif-wNw_Eov5TESRW15qEsn3buSdrxqc'; 
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
        return lang.translationError; 
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription(lang.translateDescription)
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
            textToTranslate = interaction.options.getString('text');
            targetLanguage = interaction.options.getString('language');
        } else {
            const args = interaction.content.split(' ');
            args.shift(); 
            textToTranslate = args.slice(0, -1).join(' '); 
            targetLanguage = args[args.length - 1]; 
        }

        try {
            const translatedText = await translateText(textToTranslate, targetLanguage);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Translation Result')
                .setDescription(`**${lang.originalTextLabel}** ${textToTranslate}\n**${lang.translatedTextLabel.replace('{language}', targetLanguage)}** ${translatedText}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing translate command:', error);

            await interaction.reply(lang.translationError);
        }
    },
};
