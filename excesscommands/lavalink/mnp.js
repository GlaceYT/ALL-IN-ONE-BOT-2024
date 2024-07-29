const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons'); 

module.exports = {
    name: 'mnp',
    description: 'Display the currently playing song',
    async execute(message) {
        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply('No music is currently being played in this guild.');

        const track = player.queue.current;
        const durationInSeconds = Math.floor(track.duration / 1000); 
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        const nowPlayingEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Now Playing..", 
                    iconURL: musicIcons.playerIcon,
                     url: "https://discord.gg/xQF9f9yUEM"
                    })
                .setDescription(`- **Here the information about current playing song.**\n\n **${track.title}** )`)
                .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })
                .addFields([
                    { 
                        name: 'Duration', 
                        value: `${minutes}:${seconds.toString().padStart(2, '0')}`, 
                        inline: true 
                    },
                    { name: 'Author', value: track.author, inline: true }
                ]); 

        message.reply({ embeds: [nowPlayingEmbed] });
    }
};
