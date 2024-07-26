const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const db = require('../../database/ticketdb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close-ticket')
        .setDescription('Closes the ticket and archives the channel'),

    async execute(interaction) {
        const { channel, guild, user } = interaction;

        // Check if the command is used in a ticket channel
        db.get('SELECT * FROM tickets WHERE channelId = ?', [channel.id], async (err, row) => {
            if (err) {
                console.error(err);
                return;
            }

            if (!row) {
                return interaction.reply({ content: 'This command can only be used in a ticket channel.', ephemeral: true });
            }

            // Check if the user has permissions to close the ticket
            const member = guild.members.cache.get(user.id);
            if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels) && row.userId !== user.id) {
                return interaction.reply({ content: 'You do not have permission to close this ticket.', ephemeral: true });
            }

            // Acknowledge the interaction and then proceed to delete the channel
            await interaction.reply({ content: 'This ticket will be closed in 5 seconds.', ephemeral: true });

            // Delay for 5 seconds before closing the ticket
            setTimeout(async () => {
                try {
                    await channel.delete();
                    db.run('DELETE FROM tickets WHERE id = ?', [row.id]);

                    // Optionally, send a DM to the user
                    guild.members.cache.get(row.userId).send('Your ticket has been closed.');

                } catch (error) {
                    console.error('Failed to delete the channel:', error);
                }
            }, 5000);
        });
    }
};
