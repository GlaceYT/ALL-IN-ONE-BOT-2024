const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const axios = require('axios');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription(lang.memeCommandDescription),

    async execute(interaction) {
        const memeError = lang.memeError;
        const apiUrl = 'https://www.reddit.com/r/memes/random/.json';

        try {
            const response = await axios.get(apiUrl);
            const [list] = response.data;
            const [post] = list.data.children;

            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(post.data.title)
                .setImage(post.data.url)
                .setURL(`https://reddit.com${post.data.permalink}`)
                .setFooter({ text: `👍 ${post.data.ups} | 💬 ${post.data.num_comments}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching meme:', error);
            await interaction.reply({ content: memeError, ephemeral: true });
        }
    },

    async executePrefix(message) {
        const memeError = lang.memeError;
        const apiUrl = 'https://www.reddit.com/r/memes/random/.json';

        try {
            const response = await axios.get(apiUrl);
            const [list] = response.data;
            const [post] = list.data.children;

            const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(post.data.title)
                .setImage(post.data.url)
                .setURL(`https://reddit.com${post.data.permalink}`)
                .setFooter({ text: `👍 ${post.data.ups} | 💬 ${post.data.num_comments}` });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching meme:', error);
            await message.channel.send({ content: memeError, ephemeral: true });
        }
    },
};
