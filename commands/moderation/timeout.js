const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const lang = require('../../events/loadLanguage');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription(lang.timeoutCommandDescription)
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of the timeout in minutes')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.timeoutNoPermission);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const target = interaction.options.getUser('target');
            const duration = interaction.options.getInteger('duration');
            const member = interaction.guild.members.cache.get(target.id);

            if (!member.moderatable) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.timeoutCannotTimeout.replace('{targetTag}', target.tag));
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const timeoutDuration = duration * 60 * 1000; 
            await member.timeout(timeoutDuration);
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(lang.timeoutSuccess.replace('{targetTag}', target.tag).replace('{duration}', duration));
            await interaction.reply({ embeds: [embed] });

        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Alert!", 
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.timeoutPrefixError)
                .setTimestamp();
        
            await interaction.reply({ embeds: [embed] });
        }  
    },
};
