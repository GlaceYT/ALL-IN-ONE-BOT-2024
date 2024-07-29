const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const musicIcons = require('../../UI/icons/musicicons');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set the volume for the music player')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level between 1 and 100')
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
            const volumeLevel = interaction.options.getInteger('level');
            await this.setVolume(interaction, volumeLevel);
        } else {
            const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setAuthor({ 
                name: "Alert!", 
                iconURL: cmdIcons.dotIcon ,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setDescription('- This command can only be used through slash command!\n- Please use `/volume` to control volume.')
            .setTimestamp();
        
            await interaction.reply({ embeds: [embed] });
        
            }  
    },


    async setVolume(source, volumeLevel) {
        try {
            const voiceChannel = source.member.voice.channel;

            if (!voiceChannel) {
                return source.channel.send('**You need to be in a voice channel to set the volume!**');
            }

            const permissions = voiceChannel.permissionsFor(source.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return source.channel.send('I need the permissions to join and speak in your voice channel!');
            }

            const queue = source.client.distube.getQueue(source.guildId);
            if (!queue || !queue.playing) {
                const noSongEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({
                        name: "Oops!",
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setFooter({ text: 'DisTube Player', iconURL: musicIcons.footerIcon })
                    .setDescription('There is no song currently playing.');

                return source.channel.send({ embeds: [noSongEmbed] });
            }

            queue.setVolume(volumeLevel);

            const volumeEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({
                    name: "Volume Set",
                    iconURL: musicIcons.volumeIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(`The volume has been set to **${volumeLevel}%**.`)
                .setFooter({ text: 'DisTube Player', iconURL: musicIcons.footerIcon });

            return source.channel.send({ embeds: [volumeEmbed] });
        } catch (error) {
            console.error(error);

            const errorMessage = 'An error occurred while setting the volume.';
            return source.channel.send(errorMessage);
        }
    },
};
