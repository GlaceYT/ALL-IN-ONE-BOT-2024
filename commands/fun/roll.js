const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice'),
    async execute(interaction) {
        try {
            const rollResult = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
            const embed = new EmbedBuilder()
                .setTitle('Dice Roll')
                .setColor(0xffcc00)
                .setDescription(`You rolled a ${rollResult}`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('An error occurred during command execution:', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    },
};
