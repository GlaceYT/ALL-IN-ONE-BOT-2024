const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a member in the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to mute')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of the mute in minutes')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('duration');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member.moderatable) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`I cannot mute ${target.tag}!`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const muteDuration = duration * 60 * 1000; // Convert minutes to milliseconds
        await member.timeout(muteDuration);
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(`${target.tag} has been muted for ${duration} minutes.`);
        await interaction.reply({ embeds: [embed] });
    },
};
