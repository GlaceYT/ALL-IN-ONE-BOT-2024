const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flip a coin'),
    async execute(interaction) {
        try {
            const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
            const embed = new EmbedBuilder()
                .setTitle('Coin Flip')
                .setDescription(`You flipped ${result}`)
                .setColor(0xffcc00);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('An error occurred during command execution:', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    },
};
