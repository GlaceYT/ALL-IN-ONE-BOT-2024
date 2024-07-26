const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        const [action, emojiId] = interaction.customId.split('_');
        if (action === 'emoji') {
            try {
                const emoji = interaction.client.emojis.cache.get(emojiId);
                if (!emoji) {
                    return interaction.reply({ content: 'Emoji not found.', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('Emoji Link')
                    .setDescription(`[Click here to copy the emoji link](${emoji.url})`)
                    .setImage(emoji.url)
                    .setColor('#FF00FF');

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
                }
            }
        }
    });
};
