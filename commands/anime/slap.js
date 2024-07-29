const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap someone!')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to slap')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const sender = interaction.user;
            const slappedUser = interaction.options.getUser('user');
            const slapGif = await anime.slap();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is slapping ${slappedUser}! 👋`)
                .setImage(slapGif)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const sender = interaction.author;
            const targetUser = interaction.mentions.users.first();
            const slapGif = await anime.slap();

            const embed = new EmbedBuilder()
                .setColor('#ffcc00')
                .setDescription(`${sender} is slapping ${targetUser || 'the air'}! 👋`)
                .setImage(slapGif);

            interaction.reply({ embeds: [embed] });
        }
    },
};
