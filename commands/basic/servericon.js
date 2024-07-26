const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Show the server icon'),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const serverIcon = interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

            if (!serverIcon) {
                return interaction.reply('This server does not have an icon.');
            }

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle(`${interaction.guild.name} Server Icon`)
                .setImage(serverIcon)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const serverIcon = interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

            if (!serverIcon) {
                return interaction.reply('This server does not have an icon.');
            }

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle(`${interaction.guild.name} Server Icon`)
                .setImage(serverIcon)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },
};
