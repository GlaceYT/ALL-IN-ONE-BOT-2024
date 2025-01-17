const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription(lang.serverIconDescription),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const serverIcon = interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

            if (!serverIcon) {
                return interaction.reply(lang.serverIconNoIcon);
            }

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle(lang.serverIconTitle.replace('{guildName}', interaction.guild.name))
                .setImage(serverIcon)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const serverIcon = interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

            if (!serverIcon) {
                return interaction.reply(lang.serverIconNoIcon);
            }

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle(lang.serverIconTitle.replace('{guildName}', interaction.guild.name))
                .setImage(serverIcon)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },
};
