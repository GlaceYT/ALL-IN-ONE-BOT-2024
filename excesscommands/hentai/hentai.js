const { EmbedBuilder } = require('discord.js');
const HMtai = require('hmtai');
const hmtai = new HMtai();

module.exports = {
    name: 'hentai',
    description: 'Fetches an NSFW hentai image.',
    async execute(message, args) {
        if (!message.channel.nsfw) {
            return message.reply('This command can only be used in NSFW channels.');
        }

        try {
            // Fetch NSFW Neko image
            const imageUrl = await hmtai.nsfw.hentai();
            
            // Construct the embed using EmbedBuilder
            const embed = new EmbedBuilder()
                .setTitle('NSFW hentai')
                .setImage(imageUrl)
                .setColor('#ff69b4'); // Optional: Set embed color

            // Send the embed as a reply
            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.reply('Something went wrong while fetching the image. Please try again later.');
        }
    },
};
