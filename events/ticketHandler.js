const fs = require('fs');
const path = require('path');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const db = require('../database/ticketdb');
const configPath = path.join(__dirname, '..', 'config.json');
const ticketIcons = require('../UI/icons/ticketicons');

let config = {};

function loadConfig() {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(data);
    } catch (err) {
        console.error('Error reading or parsing config file:', err);
    }
}

loadConfig();
setInterval(loadConfig, 5000);

module.exports = (client) => {
    client.on('ready', async () => {
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
        if (JSON.stringify(config) !== JSON.stringify(previousConfig)) {
            for (const guildId of Object.keys(config.tickets)) {
                const settings = config.tickets[guildId];
                const previousSettings = previousConfig.tickets[guildId];

                if (settings && settings.status && settings.ticketChannelId && (!previousSettings || settings.ticketChannelId !== previousSettings.ticketChannelId)) {
                    const guild = client.guilds.cache.get(guildId);
                    if (!guild) continue;

                    const ticketChannel = guild.channels.cache.get(settings.ticketChannelId);
                    if (!ticketChannel) continue;

                    db.get('SELECT embedSent, channelId FROM ticket_settings WHERE guildId = ?', [guildId], async (err, row) => {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        const embedSent = row ? row.embedSent : 0;
                        const savedChannelId = row ? row.channelId : null;

                        if (savedChannelId && savedChannelId !== settings.ticketChannelId) {
                            const oldChannel = guild.channels.cache.get(savedChannelId);
                            if (oldChannel) {
                                await oldChannel.messages.fetch({ limit: 100 }).then(messages => {
                                    messages.forEach(msg => {
                                        if (msg.embeds.length > 0 && msg.author.bot) {
                                            msg.delete().catch(console.error);
                                        }
                                    });
                                }).catch(console.error);
                            }
                        }

                        db.run('INSERT OR REPLACE INTO ticket_settings (guildId, embedSent, channelId) VALUES (?, ?, ?)', [guildId, 0, settings.ticketChannelId], (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });

                        if (!embedSent || savedChannelId !== settings.ticketChannelId) {
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

                            db.run('INSERT OR REPLACE INTO ticket_settings (guildId, embedSent, channelId) VALUES (?, ?, ?)', [guildId, 1, settings.ticketChannelId]);
                        }
                    });
                }
            }
            previousConfig = JSON.parse(JSON.stringify(config));
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

    db.get('SELECT * FROM tickets WHERE guildId = ? AND userId = ?', [guildId, userId], async (err, row) => {
        if (err) {
            console.error(err);
            return interaction.followUp({ content: 'An error occurred while creating your ticket.', ephemeral: true });
        }

        if (row) {
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
        db.run('INSERT INTO tickets (id, channelId, guildId, userId, type) VALUES (?, ?, ?, ?, ?)', [ticketId, ticketChannel.id, guildId, userId, ticketType]);

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
                iconURL: ticketIcons.correctIcon ,
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
    });
}

async function handleCloseButton(interaction, client) {
    await interaction.deferReply({ ephemeral: true }); 

    const ticketId = interaction.customId.replace('close_ticket_', '');
    const { guild, user } = interaction;
    if (!guild || !user) return;

    db.get('SELECT * FROM tickets WHERE id = ?', [ticketId], async (err, row) => {
        if (err) {
            console.error(err);
            return interaction.followUp({ content: 'An error occurred while closing the ticket. Please report to staff!', ephemeral: true });
        }

        if (!row) {
            return interaction.followUp({ content: 'Ticket not found. Please report to staff!', ephemeral: true });
        }

        const ticketChannel = guild.channels.cache.get(row.channelId);
        if (ticketChannel) {
            setTimeout(async () => {
                await ticketChannel.delete().catch(console.error);
            }, 5000);
        }

        db.run('DELETE FROM tickets WHERE id = ?', [ticketId]);

        const ticketUser = await client.users.fetch(row.userId);
        if (ticketUser) {

            const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setAuthor({ 
                name: "Ticket closed!", 
                iconURL: ticketIcons.correctrIcon ,
                 url: "https://discord.gg/xQF9f9yUEM"
                })
            .setDescription(`- Your ticket has been closed.`)
            .setTimestamp()
            .setFooter({ text: 'Thank you for reaching out!', iconURL: ticketIcons.modIcon });

            await ticketUser.send({ content: `Your ticket has been closed.`, embeds: [embed] });
        }

        interaction.followUp({ content: 'Ticket closed and user notified.', ephemeral: true });
    });
}
