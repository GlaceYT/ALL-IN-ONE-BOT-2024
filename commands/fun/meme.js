const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const axios = require('axios');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription(lang.memeCommandDescription),

    async execute(interaction) {
        const memeError = lang.memeError || 'Failed to fetch a meme. Please try again later!';
        const apiUrl = 'https://api.imgflip.com/get_memes';

        try {
            const response = await axios.get(apiUrl);
            
            if (response.data.success) {
                const memes = response.data.data.memes;
                const randomMeme = memes[Math.floor(Math.random() * memes.length)];

                const embed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setTitle(randomMeme.name)
                    .setImage(randomMeme.url)
                    .setFooter({ text: 'Powered by imgflip' });

                await interaction.reply({ embeds: [embed] });
            } else {
                throw new Error('Failed to fetch memes from imgflip');
            }
        } catch (error) {
            console.error('Error fetching meme:', error);
            await interaction.reply({ content: memeError, ephemeral: true });
        }
    },

    async executePrefix(message) {
        const memeError = lang.memeError || 'Failed to fetch a meme. Please try again later!';
        const apiUrl = 'https://api.imgflip.com/get_memes';

        try {
            const response = await axios.get(apiUrl);
            
            if (response.data.success) {
                const memes = response.data.data.memes;
                const randomMeme = memes[Math.floor(Math.random() * memes.length)];

                const embed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setTitle(randomMeme.name)
                    .setImage(randomMeme.url)
                    .setFooter({ text: 'Powered by imgflip' });

                await message.channel.send({ embeds: [embed] });
            } else {
                throw new Error('Failed to fetch memes from imgflip');
            }
        } catch (error) {
            console.error('Error fetching meme:', error);
            await message.channel.send({ content: memeError });
        }
    },
};