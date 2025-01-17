const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const lang = require('../../events/loadLanguage');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setslowmode')
        .setDescription(lang.setslowmodeCommandDescription)
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration of slowmode in seconds')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.setslowmodeNoPermission);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const duration = interaction.options.getInteger('duration');

            if (duration < 0 || duration > 21600) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription(lang.setslowmodeInvalidDuration);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            await interaction.channel.setRateLimitPerUser(duration);
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(lang.setslowmodeSuccess.replace('{duration}', duration));
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Alert!", 
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.setslowmodePrefixError)
                .setTimestamp();
        
            await interaction.reply({ embeds: [embed] });
        }  
    },
};
