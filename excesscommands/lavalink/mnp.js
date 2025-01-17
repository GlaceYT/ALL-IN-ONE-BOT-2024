const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mnp',
    description: 'Get information about the currently playing song',
    async execute(message) {
        
        const player = message.client.riffy.get(message.guild.id);
        if (!player || !player.current) {
            return message.reply(lang.noMusicPlaying); 
        }

        
        const track = player.current;
        
        const durationInSeconds = Math.floor(track.info.length / 1000);
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;

        
        const nowPlayingEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({ 
                name: lang.nowPlayingTitle, 
                iconURL: musicIcons.playerIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setDescription(lang.nowPlayingDescription.replace('{trackTitle}', track.info.title))
            .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
            .addFields([
                { 
                    name: lang.durationLabel, 
                    value: `${minutes}:${seconds.toString().padStart(2, '0')}`, 
                    inline: true 
                },
                { 
                    name: lang.authorLabel, 
                    value: track.info.author || 'Unknown', 
                    inline: true 
                }
            ]);

     
        message.reply({ embeds: [nowPlayingEmbed] });
    }
};