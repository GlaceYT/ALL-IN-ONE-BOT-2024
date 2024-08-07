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
                //console.error('Error managing reaction roles: Missing Permissions');
                await interaction.reply({ content: 'I do not have the required permissions to manage roles.', ephemeral: true });
            } else {
                //console.error('Error managing reaction roles:', err);
                await interaction.reply({ content: 'There was an error managing the reaction role.', ephemeral: true });
            }
        }
    });

    client.once('ready', async () => {
        const reactionRoles = await reactionRolesCollection.find({}).toArray();

        for (const rr of reactionRoles) {
            const channel = client.channels.cache.get(rr.channelId);
            if (channel) {
                const message = await channel.messages.fetch(rr.messageId);
                if (message) {
                    const button = new ButtonBuilder()
                        .setCustomId(rr.customId)
                        .setLabel(rr.label)
                        .setStyle(rr.style);

                    const row = new ActionRowBuilder().addComponents(button);

                    await message.edit({ components: [row] });
                }
            }
        }
    });
};
