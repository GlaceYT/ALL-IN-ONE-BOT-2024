const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const lang = require('../../events/loadLanguage');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removerole')
        .setDescription(lang.removeroleCommandDescription)
        .addUserOption(option =>
            option.setName('target')
                .setDescription(lang.removeroleTargetDescription)
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription(lang.removeroleRoleDescription)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.removeroleNoPermission);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const target = interaction.options.getUser('target');
            const role = interaction.options.getRole('role');
            const member = interaction.guild.members.cache.get(target.id);

            if (!member.roles.cache.has(role.id)) {
                const embed = new EmbedBuilder()
                    .setColor('#ffcc00')
                    .setDescription(lang.removeroleRoleNotFound
                        .replace('${target.tag}', target.tag)
                        .replace('${role.name}', role.name));
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.roles.remove(role);
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(lang.removeroleSuccess
                    .replace('${role.name}', role.name)
                    .replace('${target.tag}', target.tag));
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Alert!", 
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.removeroleOnlySlashCommand)
                .setTimestamp();
    
            await interaction.reply({ embeds: [embed] });
        }   
    },
};
