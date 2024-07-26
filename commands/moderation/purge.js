const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Clears a specified number of messages from the channel')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to clear')
                .setRequired(true)),
    
    async execute(interaction) {
        try {
            let amount;

            // Check if the interaction is a slash command
            if (interaction.isCommand && interaction.isCommand()) {
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription('You do not have permission to use this command.');
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                amount = interaction.options.getInteger('amount');

                if (amount < 1 || amount > 100) {
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription('Please enter a number between 1 and 100.');
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            } else {
                // For prefix command handling
                const args = interaction.content.split(' ');
                amount = parseInt(args[1]);

                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                    return interaction.reply('You do not have permission to use this command.');
                }

                if (isNaN(amount) || amount < 1 || amount > 100) {
                    return interaction.reply('Please enter a number between 1 and 100.');
                }
            }

            // Attempt to delete messages
            const messages = await interaction.channel.bulkDelete(amount, true);
            
            // Create an embed for success message
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(`Cleared ${messages.size} messages.`);
            
            // Send an ephemeral reply if it's a slash command
            if (interaction.isCommand && interaction.isCommand()) {
                return interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                // For prefix commands, send a regular message
                return;
            }
        } catch (error) {
            console.error('Error purging messages:', error);
            let errorMessage = 'Failed to purge messages. Please try again.';

            // Check specific errors
            if (error.code === 50013) {
                errorMessage = 'I do not have permission to delete messages.';
            } else if (error.code === 50034) {
                errorMessage = 'Cannot delete messages older than 14 days.';
            } else if (error.code === 50035) {
                errorMessage = 'Invalid Form Body: Unknown message reference.';
            }

            return interaction.reply({ content: errorMessage, ephemeral: true });
        }
    },
};
