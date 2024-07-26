const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showemojis')
        .setDescription('Displays available emojis with buttons'),
    async execute(interaction) {
        try {
            const allEmojis = interaction.client.emojis.cache.map(emoji => ({
                id: emoji.id,
                name: emoji.name,
                url: emoji.imageURL()
            }));

            if (allEmojis.length === 0) {
                return interaction.reply({ content: 'No custom emojis found.' });
            }

            const pageSize = 10;
            let page = 0;

            const createEmbed = () => {
                const start = page * pageSize;
                const end = start + pageSize;
                const emojis = allEmojis.slice(start, end);

                return new EmbedBuilder()
                    .setTitle('Server Emojis')
                    .setDescription(emojis.map(emoji => `${emoji.name}: [Link](${emoji.url})`).join('\n'))
                    .setColor('#00FF00');
            };

            const createRows = () => {
                const rows = [];
                let row = new ActionRowBuilder();

                const start = page * pageSize;
                const end = start + pageSize;
                const emojis = allEmojis.slice(start, end);

                emojis.forEach((emoji, index) => {
                    if (index % 5 === 0 && index !== 0) {
                        rows.push(row);
                        row = new ActionRowBuilder();
                    }

                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emoji_${emoji.id}`)
                            .setLabel(emoji.name || 'Emoji')
                            .setStyle(ButtonStyle.Secondary)
                    );
                });

                rows.push(row);

                const navigationRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous_page')
                            .setLabel('⬅️ Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId('next_page')
                            .setLabel('Next ➡️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(end >= allEmojis.length)
                    );

                rows.push(navigationRow);

                return rows;
            };

            const initialMessage = await interaction.reply({ embeds: [createEmbed()], components: createRows(), fetchReply: true });

            const filter = i => i.customId.startsWith('emoji_') || ['previous_page', 'next_page'].includes(i.customId);
            const collector = initialMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                try {
                    if (i.user.id !== interaction.user.id) {
                        return i.reply({ content: 'This interaction is not for you.', ephemeral: true });
                    }

                    if (i.customId.startsWith('emoji_')) {
                        const emojiId = i.customId.split('_')[1];
                        const emoji = interaction.client.emojis.cache.get(emojiId);
                        if (!emoji) {
                            return i.reply({ content: 'Emoji not found.', ephemeral: true });
                        }

                        const embed = new EmbedBuilder()
                            .setTitle('Selected Emoji')
                            .setDescription(`[Click here to copy the emoji link](${emoji.url})`)
                            .setImage(emoji.url)
                            .setColor('#FF00FF');

                        await i.update({ embeds: [embed], components: createRows() });
                    } else if (i.customId === 'previous_page') {
                        if (page > 0) {
                            page--;
                            await i.update({ embeds: [createEmbed()], components: createRows() });
                        }
                    } else if (i.customId === 'next_page') {
                        if ((page + 1) * pageSize < allEmojis.length) {
                            page++;
                            await i.update({ embeds: [createEmbed()], components: createRows() });
                        }
                    }
                } catch (error) {
                    
                    if (!i.replied && !i.deferred) {
                        await i.reply({ content: 'An error occurred while processing your request.', ephemeral: true }).catch(() => {});
                    }
                }
            });

            collector.on('end', () => {
                initialMessage.edit({ components: [] }).catch(() => {});
            });

        } catch (error) {
            console.error('Error executing command:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'An error occurred while executing the command.' }).catch(() => {});
            }
        }
    }
};

// To suppress specific error messages, we can override the console.error method temporarily.
const originalConsoleError = console.error;
console.error = (message, ...optionalParams) => {
    if (typeof message === 'string' && (message.includes('Unknown interaction') || message.includes('Interaction has already been acknowledged'))) {
        // Suppress these specific error messages
        return;
    }
    // For other errors, call the original console.error method
    originalConsoleError(message, ...optionalParams);
};
