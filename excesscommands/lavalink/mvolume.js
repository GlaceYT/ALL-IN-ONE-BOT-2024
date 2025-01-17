const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'mvolume',
    description: lang.mvolumeDescription,
    async execute(message, args) {
        const player = message.client.riffy.get(message.guild.id);
        if (!player) return message.reply(lang.noMusicPlayingError);

        const volumeEmbed = new EmbedBuilder()
            .setColor('#DC92FF');

       
        if (!args[0]) {
            volumeEmbed
                .setAuthor({
                    name: lang.volumeControlTitle,
                    iconURL: musicIcons.volumeIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
                .setDescription(`${lang.currentVolumeText} ${player.volume}%`);
            return message.reply({ embeds: [volumeEmbed] });
        }

        
        if (isNaN(args[0])) return message.reply(lang.invalidNumberError);

      
        const volume = Math.max(Math.min(parseInt(args[0]), 100), 0);
        player.setVolume(volume); 

        volumeEmbed
            .setAuthor({
                name: lang.volumeControlTitle,
                iconURL: musicIcons.volumeIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: lang.footerText, iconURL: musicIcons.footerIcon })
            .setDescription(`${lang.volumeSetText} ${volume}%`);
        message.reply({ embeds: [volumeEmbed] }); 
    }
};