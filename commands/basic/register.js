const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registers you'),
    async execute(interaction) {
        await interaction.reply('Registered!');
    },
};
