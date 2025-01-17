const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription(lang.addRoleCommandDescription)
        .addUserOption(option =>
            option.setName('target')
                .setDescription(lang.addRoleTargetDescription)
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription(lang.addRoleRoleDescription)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.addRoleNoPermission);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const target = interaction.options.getUser('target');
            const role = interaction.options.getRole('role');
            const member = interaction.guild.members.cache.get(target.id);

            if (member.roles.cache.has(role.id)) {
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setDescription(lang.addRoleAlreadyHasRole.replace('${target.tag}', target.tag).replace('${role.name}', role.name));
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.roles.add(role);
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(lang.addRoleSuccess.replace('${role.name}', role.name).replace('${target.tag}', target.tag));
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({
                    name: lang.addRoleAlert,
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.addRoleOnlySlashCommand)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },
};
