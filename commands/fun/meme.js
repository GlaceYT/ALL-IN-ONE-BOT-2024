const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme from Reddit'),
    async execute(interaction) {
        const apiUrl = 'https://www.reddit.com/r/memes/random/.json';

        try {
            const response = await axios.get(apiUrl);
            const [list] = response.data;
            const [post] = list.data.children;

            const embed = new EmbedBuilder()
                .setColor('#ff4500')
                .setTitle(post.data.title)
                .setImage(post.data.url)
                .setURL(`https://reddit.com${post.data.permalink}`)
                .setFooter({ text: `👍 ${post.data.ups} | 💬 ${post.data.num_comments}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching meme:', error);
            await interaction.reply('An error occurred while fetching the meme.');
        }
    },
    async executePrefix(message) {
        const apiUrl = 'https://www.reddit.com/r/memes/random/.json';

        try {
            const response = await axios.get(apiUrl);
            const [list] = response.data;
            const [post] = list.data.children;

            const embed = new EmbedBuilder()
                .setColor('#ff4500')
                .setTitle(post.data.title)
                .setImage(post.data.url)
                .setURL(`https://reddit.com${post.data.permalink}`)
                .setFooter({ text: `👍 ${post.data.ups} | 💬 ${post.data.num_comments}` });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching meme:', error);
            await message.channel.send('An error occurred while fetching the meme.');
        }
    },
};