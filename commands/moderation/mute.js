const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription(lang.muteCommandDescription)
        .addUserOption(option =>
            option.setName('target')
                .setDescription(lang.muteTargetDescription)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription(lang.muteDurationDescription)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.muteNoPermission);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const target = interaction.options.getUser('target');
            const duration = interaction.options.getInteger('duration');
            const member = interaction.guild.members.cache.get(target.id);

            if (!member.moderatable) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.muteCannotMute.replace('${target.tag}', target.tag));
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const muteDuration = duration * 60 * 1000; 
            await member.timeout(muteDuration);
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(lang.muteSuccess.replace('${target.tag}', target.tag).replace('${duration}', duration));
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: lang.muteAlert, 
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.muteOnlySlashCommand)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }  
    },
};
