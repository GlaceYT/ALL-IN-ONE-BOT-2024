const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons'); 

module.exports = {
    name: 'mstop',
    description: 'Stop the music and clear the queue',
    async execute(message) {
        const player = message.client.manager.players.get(message.guild.id);

        if (!player || !player.queue.current) {
            return message.reply('No music is currently playing!');
        }

        player.destroy();

        const stoppedEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Stopped!", 
                    iconURL: musicIcons.stopIcon ,
                     url: "https://discord.gg/xQF9f9yUEM"
                    })
                .setFooter({ text: 'Lavalink Player', iconURL: musicIcons.footerIcon })   
                .setDescription('**The queue has been stopped**');
                message.reply({ embeds: [stoppedEmbed] });
    }
};
