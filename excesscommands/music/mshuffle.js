const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons'); 

module.exports = {
    name: 'mshuffle',
    description: 'Shuffle the music queue',
    async execute(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('**No music is currently being played in this guild.**');

        const queue = player.queue;
        if (!queue.length) return message.reply('**The queue is empty.**'); 

        player.queue.shuffle(); 

        const shuffleEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({ 
                name: 'Queue update', 
                iconURL: musicIcons.correctIcon 
            })
            .setDescription('**Randomized the queue songs order.**')
            .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon });

        message.reply({ embeds: [shuffleEmbed] });
    }
};
