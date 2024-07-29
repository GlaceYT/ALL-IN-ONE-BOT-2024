const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Adds a role to a member')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to add a role to')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to add')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
         if (interaction.isCommand && interaction.isCommand()) { 
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const role = interaction.options.getRole('role');
        const member = interaction.guild.members.cache.get(target.id);

        if (member.roles.cache.has(role.id)) {
            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${target.tag} already has the role ${role.name}.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await member.roles.add(role);
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(`Added the role ${role.name} to ${target.tag}.`);
        await interaction.reply({ embeds: [embed] });
    } else {
    const embed = new EmbedBuilder()
    .setColor('#3498db')
    .setAuthor({ 
        name: "Alert!", 
        iconURL: cmdIcons.dotIcon ,
        url: "https://discord.gg/xQF9f9yUEM"
    })
    .setDescription('- This command can only be used through slash command!\n- Please use `/addrole` to add a role to a member.')
    .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    }   

    },
};
