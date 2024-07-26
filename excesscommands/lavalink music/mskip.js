const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons'); 

module.exports = {
    name: 'mskip',
    description: 'Skip the current song',
    async execute(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('No music is currently being played in this guild.');

        const currentTrack = player.queue.current; // Store the current track
        player.stop(); 

        let nextSongEmbed;
        if (player.queue.size > 0) {
            const nextTrack = player.queue[0];
            nextSongEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Song Skipped", 
                    iconURL: musicIcons.skipIcon ,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })  
                .setDescription(`- **Playing next song.**\n\n **${nextTrack.title}**`); 
        } else {
            nextSongEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "No songs", 
                    iconURL: musicIcons.skipIcon ,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })  
                .setDescription(`- **No more tracks in queue.**`);
        }
        message.reply({ embeds: [nextSongEmbed] }); 
    }
};
