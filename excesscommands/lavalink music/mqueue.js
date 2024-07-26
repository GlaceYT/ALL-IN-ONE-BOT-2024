const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons'); 

module.exports = {
    name: 'mqueue',
    description: 'Display the current music queue',
    async execute(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('No music is currently being played in this guild.');
        
        const queue = player.queue;
        if (!queue.length) return message.reply('The queue is currently empty.');

        const embeds = [];
        const tracksPerPage = 10;

        for (let i = 0; i < queue.length; i += tracksPerPage) {
            const pageEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ name: `Queue - Page ${Math.floor(i / tracksPerPage) + 1}`, iconURL: musicIcons.queueIcon })
                .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon });

            const pageTracks = queue.slice(i, i + tracksPerPage);
            let description = ""; 
            for (let j = 0; j < pageTracks.length; j++) {
                description += `${i + j + 1}. ${pageTracks[j].title} - ${pageTracks[j].author}\n`; 
            }
            pageEmbed.setDescription(description);

            embeds.push(pageEmbed);
        }

        try {
            await message.channel.send({ embeds });
        } catch (error) {
            console.error('Error sending queue embeds:', error);
            message.reply('An error occurred while displaying the queue.');
        }
    }
};
