const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription(lang.kickCommandDescription)
        .addUserOption(option =>
            option.setName('target')
                .setDescription(lang.kickTargetDescription)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.kickNoPermission);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const target = interaction.options.getUser('target');
            const member = interaction.guild.members.cache.get(target.id);

            if (!member.kickable) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.kickCannotKick.replace('${target.tag}', target.tag));
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await member.kick();
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(lang.kickSuccess.replace('${target.tag}', target.tag));
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: lang.kickAlert, 
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.kickOnlySlashCommand)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }  
    },
};
