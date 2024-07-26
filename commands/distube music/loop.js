const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle looping for the current song or entire queue')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode: "queue" or "song"')
                .setRequired(false)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
        }

        try {
            await executeLoop(interaction);
        } catch (error) {
            console.error(error);
            const errorMessage = 'An error occurred while trying to toggle loop mode.';
            await interaction.editReply(errorMessage);
        }
    },

    async executePrefix(message, args) {
        try {
            await executeLoop(message);
        } catch (error) {
            console.error(error);
            const errorMessage = 'An error occurred while trying to toggle loop mode.';
            await message.channel.send(errorMessage);
        }
    },
};

async function executeLoop(source) {
    const voiceChannel = source.member.voice.channel;

    if (!voiceChannel) {
        if (source.isCommand && source.isCommand()) {
            return source.editReply('**You need to be in a voice channel to control music playback!**');
        } else {
            return source.channel.send('**You need to be in a voice channel to control music playback!**');
        }
    }

    const permissions = voiceChannel.permissionsFor(source.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        if (source.isCommand && source.isCommand()) {
            return source.editReply('I need the permissions to join and speak in your voice channel!');
        } else {
            return source.channel.send('I need the permissions to join and speak in your voice channel!');
        }
    }

    const loopMode = source.options?.getString('mode') || (source.content.split(/\s+/)[1] || '').toLowerCase();

    const guildId = source.guildId;
    const queue = source.client.distube.getQueue(guildId);

    if (!queue) {
        const noQueueEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({ 
                name: "Oops!", 
                iconURL: musicIcons.wrongIcon ,
                 url: "https://discord.gg/xQF9f9yUEM"
                })
        .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })  
            .setDescription('**There is no queue in this guild.**');

        if (source.isCommand && source.isCommand()) {
            return source.editReply({ embeds: [noQueueEmbed] });
        } else {
            return source.channel.send({ embeds: [noQueueEmbed] });
        }
    }

    const toggleLoopEmbed = new EmbedBuilder()
        .setColor('#DC92FF')
        .setFooter({ text: 'MUSIC PLAYER - Distube', iconURL: musicIcons.footerIcon })  
        .setAuthor({ 
            name: "Loop", 
            iconURL: musicIcons.loopIcon ,
             url: "https://discord.gg/xQF9f9yUEM"
            });
    if (loopMode === 'queue') {
        await source.client.distube.setRepeatMode(guildId, 2); 
        toggleLoopEmbed.setDescription('**Looping mode enabled for the entire queue.**');
    } else if (loopMode === 'song') {
        await source.client.distube.setRepeatMode(guildId, 1); 
        toggleLoopEmbed.setDescription('**Looping mode enabled for the current song.**');
    } else {
       
        if (queue.repeatMode === 1) {
            await source.client.distube.setRepeatMode(guildId, 0);
            toggleLoopEmbed.setDescription('**Looping mode disabled.**');
        } else if (queue.repeatMode === 0) {
            await source.client.distube.setRepeatMode(guildId, 1); 
            toggleLoopEmbed.setDescription('**Looping mode enabled for the current song.**');
        } else {
            await source.client.distube.setRepeatMode(guildId, 0);
            toggleLoopEmbed.setDescription('**Looping mode disabled.**');
        }
    }

    if (source.isCommand && source.isCommand()) {
        await source.editReply({ embeds: [toggleLoopEmbed] });
    } else {
        await source.channel.send({ embeds: [toggleLoopEmbed] });
    }
}
