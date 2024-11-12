const { ticketsCollection } = require('../mongodb');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const ticketIcons = require('../UI/icons/ticketicons');

let config = {};

async function loadConfig() {
    try {
        const tickets = await ticketsCollection.find({}).toArray();
        config.tickets = tickets.reduce((acc, ticket) => {
            acc[ticket.serverId] = {
                ticketChannelId: ticket.ticketChannelId,
                adminRoleId: ticket.adminRoleId,
                status: ticket.status
            };
            return acc;
        }, {});
    } catch (err) {
        //console.error('Error loading config from MongoDB:', err);
    }
}

setInterval(loadConfig, 5000);

module.exports = (client) => {
    client.on('ready', async () => {
        await loadConfig();
        monitorConfigChanges(client);
    });

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isStringSelectMenu() && interaction.customId === 'select_ticket_type') {
            handleSelectMenu(interaction, client);
        } else if (interaction.isButton() && interaction.customId.startsWith('close_ticket_')) {
            handleCloseButton(interaction, client);
        }
    });
};

async function monitorConfigChanges(client) {
    let previousConfig = JSON.parse(JSON.stringify(config));

    setInterval(async () => {
        await loadConfig();
        if (JSON.stringify(config) !== JSON.stringify(previousConfig)) {
            for (const guildId of Object.keys(config.tickets)) {
                const settings = config.tickets[guildId];
                const previousSettings = previousConfig.tickets[guildId];

                if (settings && settings.status && settings.ticketChannelId && (!previousSettings || settings.ticketChannelId !== previousSettings.ticketChannelId)) {
                    const guild = client.guilds.cache.get(guildId);
                    if (!guild) continue;

                    const ticketChannel = guild.channels.cache.get(settings.ticketChannelId);
                    if (!ticketChannel) continue;

          
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: "Welcome to Ticket Support",
                            iconURL: ticketIcons.mainIcon,
                            url: "https://discord.gg/xQF9f9yUEM"
                        })
                        .setDescription('- Please click below menu to create a new ticket.\n\n' +
                            '**Ticket Guidelines:**\n' +
                            '- Empty tickets are not permitted.\n' +
                            '- Please be patient while waiting for a response from our support team.')
                        .setFooter({ text: 'We are here to Help!', iconURL: ticketIcons.modIcon })
                        .setColor('#00FF00')
                        .setTimestamp();

                    const menu = new StringSelectMenuBuilder()
                        .setCustomId('select_ticket_type')
                        .setPlaceholder('Choose ticket type')
                        .addOptions([
                            { label: '🆘 Support', value: 'support' },
                            { label: '📂 Suggestion', value: 'suggestion' },
                            { label: '💜 Feedback', value: 'feedback' },
                            { label: '⚠️ Report', value: 'report' }
                        ]);

                    const row = new ActionRowBuilder().addComponents(menu);

                    await ticketChannel.send({
                        embeds: [embed],
                        components: [row]
                    });

                    previousConfig = JSON.parse(JSON.stringify(config));
                }
            }
        }
    }, 5000);
}

async function handleSelectMenu(interaction, client) {
    await interaction.deferReply({ ephemeral: true }); 

    const { guild, user, values } = interaction;
    if (!guild || !user) return;

    const guildId = guild.id;
    const userId = user.id;
    const ticketType = values[0];
    const settings = config.tickets[guildId];
    if (!settings) return;

    const ticketExists = await ticketsCollection.findOne({ guildId, userId });
    if (ticketExists) {
        return interaction.followUp({ content: 'You already have an open ticket.', ephemeral: true });
    }

    const ticketChannel = await guild.channels.create({
        name: `${user.username}-${ticketType}-ticket`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: userId,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
            },
            {
                id: settings.adminRoleId,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
            }
        ]
    });

    const ticketId = `${guildId}-${ticketChannel.id}`;
    await ticketsCollection.insertOne({ id: ticketId, channelId: ticketChannel.id, guildId, userId, type: ticketType });

    const ticketEmbed = new EmbedBuilder()
        .setAuthor({
            name: "Support Ticket",
            iconURL: ticketIcons.modIcon,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription(`Hello ${user}, welcome to our support!\n- Please provide a detailed description of your issue\n- Our support team will assist you as soon as possible.\n- Feel free to open another ticket if this was closed.`)
        .setFooter({ text: 'Your satisfaction is our priority', iconURL: ticketIcons.heartIcon })
        .setColor('#00FF00')
        .setTimestamp();

    const closeButton = new ButtonBuilder()
        .setCustomId(`close_ticket_${ticketId}`)
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger);

    const actionRow = new ActionRowBuilder().addComponents(closeButton);

    await ticketChannel.send({ content: `${user}`, embeds: [ticketEmbed], components: [actionRow] });

    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ 
            name: "Ticket Created!", 
            iconURL: ticketIcons.correctIcon,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription(`- Your ${ticketType} ticket has been created.`)
        .addFields(
            { name: 'Ticket Channel', value: `${ticketChannel.url}` },
            { name: 'Instructions', value: 'Please describe your issue in detail.' }
        )
        .setTimestamp()
        .setFooter({ text: 'Thank you for reaching out!', iconURL: ticketIcons.modIcon });

    await user.send({ content: `Your ${ticketType} ticket has been created`, embeds: [embed] });

    interaction.followUp({ content: 'Ticket created!', ephemeral: true });
}

async function handleCloseButton(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const ticketId = interaction.customId.replace('close_ticket_', '');
    const { guild, user } = interaction;
    if (!guild || !user) return;

    const ticket = await ticketsCollection.findOne({ id: ticketId });
    if (!ticket) {
        return interaction.followUp({ content: 'Ticket not found. Please report to staff!', ephemeral: true });
    }

    const ticketChannel = guild.channels.cache.get(ticket.channelId);
    if (ticketChannel) {
        setTimeout(async () => {
            await ticketChannel.delete().catch(console.error);
        }, 5000);
    }

    await ticketsCollection.deleteOne({ id: ticketId });

    const ticketUser = await client.users.fetch(ticket.userId);
    if (ticketUser) {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setAuthor({
                name: "Ticket closed!",
                iconURL: ticketIcons.correctrIcon,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setDescription(`- Your ticket has been closed.`)
            .setTimestamp()
            .setFooter({ text: 'Thank you for reaching out!', iconURL: ticketIcons.modIcon });

        await ticketUser.send({ content: `Your ticket has been closed.`, embeds: [embed] });
    }

    // Now send the rating dropdown to the user
    const ratingEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({
            name: "Rate Your Support Experience",
            iconURL: ticketIcons.correctrIcon,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('Please rate your experience with our support team.')
        .setFooter({ text: 'Your feedback is important to us!', iconURL: ticketIcons.heartIcon })
        .setTimestamp();

    const ratingMenu = new StringSelectMenuBuilder()
        .setCustomId(`rate_ticket_${ticketId}`)
        .setPlaceholder('Rate your experience')
        .addOptions([
            { label: '🌟 Excellent', value: 'excellent' },
            { label: '🙂 Good', value: 'good' },
            { label: '😐 Average', value: 'average' },
            { label: '😞 Poor', value: 'poor' }
        ]);

    const actionRow = new ActionRowBuilder().addComponents(ratingMenu);

    // Send the rating menu to the user
    await ticketUser.send({
        embeds: [ratingEmbed],
        components: [actionRow]
    });

    interaction.followUp({ content: 'Ticket closed and user notified. A rating menu has been sent to the user.', ephemeral: true });
}

async function handleSelectMenu(interaction, client) {
    if (interaction.customId.startsWith('rate_ticket_')) {
        // This is a rating interaction, handle it separately
        const ticketId = interaction.customId.replace('rate_ticket_', '');
        const rating = interaction.values[0];  // Get the selected rating

        // Fetch ticket information (if needed for logging or processing)
        const ticket = await ticketsCollection.findOne({ id: ticketId });
        if (!ticket) {
            return interaction.followUp({ content: 'Ticket not found. Please report to staff!', ephemeral: true });
        }

        // Here you can store the rating in the database (optional)
        await ticketsCollection.updateOne(
            { id: ticketId },
            { $set: { rating } }  // Add the rating to the ticket entry
        );

        // Acknowledge the rating and thank the user
        await interaction.update({
            content: `Thank you for your feedback, ${interaction.user.username}!`,
            components: [],
            ephemeral: true
        });

        // Optionally, send a message to the support staff or log the rating
        const supportGuild = client.guilds.cache.get(ticket.guildId);
        if (supportGuild) {
            const adminRole = supportGuild.roles.cache.get(ticket.adminRoleId);
            if (adminRole) {
                const ratingEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Ticket Rating Submitted")
                    .setDescription(`User ${interaction.user.username} rated their support experience as: **${rating}**`)
                    .setFooter({ text: 'Support team notified.', iconURL: ticketIcons.modIcon })
                    .setTimestamp();

                // Send rating to admin or support team
                await supportGuild.channels.cache.get(ticket.ticketChannelId).send({
                    embeds: [ratingEmbed]
                });
            }
        }
    }
}
