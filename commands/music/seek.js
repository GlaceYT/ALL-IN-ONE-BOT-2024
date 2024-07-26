const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific timestamp in the currently playing song')
        .addStringOption(option =>
            option.setName('timestamp')
                .setDescription('Timestamp to seek to (in seconds or in mm:ss format)')
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
            const timestamp = interaction.options.getString('timestamp');
            await this.handleSeekCommand(interaction, timestamp);
        }
    },

    async executePrefix(message, args) {
       
        message.channel.send('**Please use slash command.**');
      
    },

    async handleSeekCommand(source, timestamp) {
        try {
            const voiceChannel = source.member.voice.channel;

            if (!voiceChannel) {
                return source.channel.send('**You need to be in a voice channel to seek!**');
            }

            const permissions = voiceChannel.permissionsFor(source.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return source.channel.send('**I need the permissions to join and speak in your voice channel!**');
            }

            // Validate seek time format (either seconds or mm:ss)
            const seekSeconds = this.parseSeekTime(timestamp);
            if (seekSeconds === -1) {
                return source.channel.send('**Invalid timestamp format. Please use seconds (e.g., 120) or mm:ss (e.g., 2:00).**');
            }

            await source.channel.send('**Seeking to the specified timestamp...**');

            // Seek to the specified time
            await source.client.distube.seek(voiceChannel, seekSeconds);

            const seekEmbed = new EmbedBuilder()
                .setColor('#DC92FF')
                .setAuthor({ 
                    name: "Sucessfully seeked!", 
                    iconURL: musicIcons.correctIcon ,
                     url: "https://discord.gg/xQF9f9yUEM"
                    })
                .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })
                .setDescription(`Seeked to ${this.formatTimestamp(seekSeconds)}`);

            await source.channel.send({ embeds: [seekEmbed] });

        } catch (error) {
            console.error(error);

            if (error instanceof DisTubeError && error.code === 'NO_QUEUE') {
                const noQueueEmbed = new EmbedBuilder()
                    .setColor('#DC92FF')
                    .setAuthor({ 
                        name: "Oops!", 
                        iconURL: musicIcons.wrongIcon ,
                         url: "https://discord.gg/xQF9f9yUEM"
                        })
                    .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })       
                    .setDescription('There is no playing queue in this guild.');

                await source.channel.send({ embeds: [noQueueEmbed] });
            } else {
                const errorMessage = 'An error occurred while trying to seek.';
                await source.channel.send(errorMessage);
            }
        }
    },


    parseSeekTime(timeString) {
        const timeRegex = /^(\d+):(\d+)$/;
        if (timeRegex.test(timeString)) {
            const match = timeString.match(timeRegex);
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            return minutes * 60 + seconds;
        } else if (!isNaN(timeString)) {
            return parseInt(timeString, 10);
        } else {
            return -1;
        }
    },

 
    formatTimestamp(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
};
