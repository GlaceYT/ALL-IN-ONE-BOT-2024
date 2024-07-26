const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeslowmode')
        .setDescription('Removes the slowmode from the channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.channel.setRateLimitPerUser(0);
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription('Removed slowmode from the channel.');
        await interaction.reply({ embeds: [embed] });
    },
};
