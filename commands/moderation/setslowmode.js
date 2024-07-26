const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setslowmode')
        .setDescription('Sets the slowmode for the channel')
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of slowmode in seconds')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const duration = interaction.options.getInteger('duration');

        if (duration < 0 || duration > 21600) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('Please enter a duration between 0 and 21600 seconds.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.channel.setRateLimitPerUser(duration);
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(`Set slowmode to ${duration} seconds.`);
        await interaction.reply({ embeds: [embed] });
    },
};
