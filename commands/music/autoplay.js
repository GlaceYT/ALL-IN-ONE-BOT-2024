const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay feature on or off'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
        }

        try {
            await executeAutoplay(interaction);
        } catch (error) {
            console.error(error);
            const errorMessage = 'An error occurred while trying to toggle autoplay.';
            await interaction.editReply(errorMessage);
        }
    },

    async executePrefix(message) {
        try {
            await executeAutoplay(message);
        } catch (error) {
            console.error(error);
            const errorMessage = 'An error occurred while trying to toggle autoplay.';
            await message.channel.send(errorMessage);
        }
    },
};

async function executeAutoplay(source) {
    try {
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

        const autoplayMode = queue.toggleAutoplay();
        const autoplayStatus = autoplayMode ? 'enabled' : 'disabled';

        const autoplayEmbed = new EmbedBuilder()
            .setColor('#DC92FF')
            .setAuthor({ 
                name: "Autoplay", 
                iconURL: musicIcons.playIcon ,
                 url: "https://discord.gg/xQF9f9yUEM"
                })
            .setDescription(`**Autoplay feature has been ${autoplayStatus}.**`);

        if (source.isCommand && source.isCommand()) {
            await source.editReply({ embeds: [autoplayEmbed] });
        } else {
            await source.channel.send({ embeds: [autoplayEmbed] });
        }
    } catch (error) {
        console.error(error);

        const errorMessage = 'An error occurred while toggling autoplay feature.';
        if (source.isCommand && source.isCommand()) {
            await source.editReply(errorMessage);
        } else {
            await source.channel.send(errorMessage);
        }
    }
}
