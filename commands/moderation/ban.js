const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member.bannable) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(`I cannot ban ${target.tag}!`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await member.ban();
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(`${target.tag} has been banned.`);
        await interaction.reply({ embeds: [embed] });
    },
};
