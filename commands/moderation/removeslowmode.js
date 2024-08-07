const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeslowmode')
        .setDescription(lang.removeSlowModeDescription)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(lang.removeSlowModeNoPermission);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.channel.setRateLimitPerUser(0);
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(lang.removeSlowModeSuccess);
        await interaction.reply({ embeds: [embed] });
    },
};
