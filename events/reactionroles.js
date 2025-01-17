const { Client, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { reactionRolesCollection } = require('../mongodb');
const { DiscordAPIError } = require('discord.js');

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        const { customId, guild, user } = interaction;
        const member = guild.members.cache.get(user.id);

        try {
            const reactionRole = await reactionRolesCollection.findOne({ messageId: interaction.message.id, customId });

            if (reactionRole) {
                const role = guild.roles.cache.get(reactionRole.roleId);
                if (role) {
                    if (member.roles.cache.has(role.id)) {
                        await member.roles.remove(role);
                        await interaction.reply({ content: `Role ${role.name} removed.`, ephemeral: true });
                    } else {
                        await member.roles.add(role);
                        await interaction.reply({ content: `Role ${role.name} added.`, ephemeral: true });
                    }
                }
            }
        } catch (err) {
            if (err instanceof DiscordAPIError && err.code === 50013) {
                await interaction.reply({ content: 'I do not have the required permissions to manage roles.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error managing the reaction role.', ephemeral: true });
            }
        }
    });

    client.once('ready', async () => {
        const reactionRoles = await reactionRolesCollection.find({}).toArray();

        for (const rr of reactionRoles) {
            try {
                // Fetch the channel
                const channel = client.channels.cache.get(rr.channelId);
                if (!channel) {
                    // If the channel doesn't exist, remove the entry from the database
                    await reactionRolesCollection.deleteOne({ messageId: rr.messageId });
                    console.log(`Deleted reaction role for non-existing channel: ${rr.channelId}`);
                    continue;
                }

                // Fetch the message
                const message = await channel.messages.fetch(rr.messageId).catch(() => null);
                if (!message) {
                    // If the message doesn't exist, remove the entry from the database
                    await reactionRolesCollection.deleteOne({ messageId: rr.messageId });
                    console.log(`Deleted reaction role for non-existing message: ${rr.messageId}`);
                    continue;
                }

                // Create a button for the reaction role
                const button = new ButtonBuilder()
                    .setCustomId(rr.customId)
                    .setLabel(rr.label)
                    .setStyle(rr.style);

                const row = new ActionRowBuilder().addComponents(button);

                // Update the message with the button
                await message.edit({ components: [row] });
            } catch (err) {
                //console.error(`Error processing reaction role for message ${rr.messageId}:`, err);
            }
        }
    });
};
