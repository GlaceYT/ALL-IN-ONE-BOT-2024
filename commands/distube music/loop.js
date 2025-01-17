const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription(lang.loopDescription)
        .addStringOption(option =>
            option.setName('mode')
                .setDescription(lang.loopModeDescription)
                .setRequired(false)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
        }

        try {
            await executeLoop(interaction);
        } catch (error) {
            console.error(error);
            const errorMessage = lang.loopError;
            await interaction.editReply(errorMessage);
        }
    },

    async executePrefix(message, args) {
        try {
            await executeLoop(message);
        } catch (error) {
            console.error(error);
            const errorMessage = lang.loopError;
            await message.channel.send(errorMessage);
        }
    },
};

async function executeLoop(source) {
    const voiceChannel = source.member.voice.channel;

    if (!voiceChannel) {
        const errorMessage = lang.loopNoVoiceChannel;
        if (source.isCommand && source.isCommand()) {
            return source.editReply(errorMessage);
        } else {
            return source.channel.send(errorMessage);
        }
    }

    const permissions = voiceChannel.permissionsFor(source.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        const permissionMessage = lang.loopNoPermissions;
        if (source.isCommand && source.isCommand()) {
            return source.editReply(permissionMessage);
        } else {
            return source.channel.send(permissionMessage);
        }
    }

    const loopMode = source.options?.getString('mode') || (source.content.split(/\s+/)[1] || '').toLowerCase();

    const guildId = source.guildId;
    const queue = source.client.distube.getQueue(guildId);

    if (!queue) {
        const noQueueEmbed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setAuthor({ 
                name: lang.loopNoQueueTitle, 
                iconURL: musicIcons.wrongIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setFooter({ text: lang.loopFooterText, iconURL: musicIcons.footerIcon })
            .setDescription(lang.loopNoQueue);

        if (source.isCommand && source.isCommand()) {
            return source.editReply({ embeds: [noQueueEmbed] });
        } else {
            return source.channel.send({ embeds: [noQueueEmbed] });
        }
    }

    const toggleLoopEmbed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setFooter({ text: lang.loopFooterText, iconURL: musicIcons.footerIcon })
        .setAuthor({ 
            name: lang.loopTitle, 
            iconURL: musicIcons.loopIcon,
            url: "https://discord.gg/xQF9f9yUEM"
        });

    if (loopMode === 'queue') {
        await source.client.distube.setRepeatMode(guildId, 2);
        toggleLoopEmbed.setDescription(lang.loopQueueEnabled);
    } else if (loopMode === 'song') {
        await source.client.distube.setRepeatMode(guildId, 1);
        toggleLoopEmbed.setDescription(lang.loopSongEnabled);
    } else {
        if (queue.repeatMode === 1) {
            await source.client.distube.setRepeatMode(guildId, 0);
            toggleLoopEmbed.setDescription(lang.loopDisabled);
        } else if (queue.repeatMode === 0) {
            await source.client.distube.setRepeatMode(guildId, 1);
            toggleLoopEmbed.setDescription(lang.loopSongEnabled);
        } else {
            await source.client.distube.setRepeatMode(guildId, 0);
            toggleLoopEmbed.setDescription(lang.loopDisabled);
        }
    }

    if (source.isCommand && source.isCommand()) {
        await source.editReply({ embeds: [toggleLoopEmbed] });
    } else {
        await source.channel.send({ embeds: [toggleLoopEmbed] });
    }
}
