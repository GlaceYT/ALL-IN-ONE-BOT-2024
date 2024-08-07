const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        const [action, emojiId] = interaction.customId.split('_');
        if (action === 'emoji') {
            try {
                await interaction.deferReply({ ephemeral: true });

                const emoji = interaction.client.emojis.cache.get(emojiId);
                if (!emoji) {
                    await interaction.followUp({ content: 'Emoji not found.', ephemeral: true });
                    return;
                }

                const embed = new EmbedBuilder()
                    .setTitle('Emoji Link')
                    .setDescription(`[Click here to copy the emoji link](${emoji.url})`)
                    .setImage(emoji.url)
                    .setColor('#FF00FF');

                await interaction.followUp({ embeds: [embed], ephemeral: true });
            } catch (error) {
                // err
                if (!interaction.replied && !interaction.deferred) {
                    try {
                        await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
                    } catch (innerError) {
                        // err
                    }
                }
            }
        }
    });
};
