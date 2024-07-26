const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const db = require('../database/ticketdb');
const config = require('../config.json');

module.exports = (client) => {
    client.on('ready', async () => {
        

        for (const guildId of Object.keys(config.tickets)) {
            const settings = config.tickets[guildId];

            if (settings && settings.status && settings.ticketChannelId) {
                const guild = client.guilds.cache.get(guildId);
                const ticketChannel = guild.channels.cache.get(settings.ticketChannelId);

                if (ticketChannel) {
                    // Check if the create ticket embed is already sent
                    const messages = await ticketChannel.messages.fetch({ limit: 100 });
                    const createTicketMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === 'Support Ticket');

                    if (!createTicketMessage) {
                        const embed = new EmbedBuilder()
                            .setTitle('Support Ticket')
                            .setDescription('Click the button below to create a support ticket.')
                            .setColor('#00FF00')
                            .setTimestamp();

                        const createTicketButton = new ButtonBuilder()
                            .setCustomId('create_ticket')
                            .setLabel('Create Ticket')
                            .setStyle(ButtonStyle.Primary);

                        const row = new ActionRowBuilder().addComponents(createTicketButton);

                        await ticketChannel.send({
                            embeds: [embed],
                            components: [row]
                        });
                    }
                } else {
                    console.log(`Ticket channel not found for guild: ${guild.name}`);
                }
            }
        }
    });

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton() || interaction.customId !== 'create_ticket') return;

        const { guild, user } = interaction;
        const guildId = guild.id;
        const userId = user.id;
        const settings = config.tickets[guildId];

        // Check if the user already has an open ticket
        db.get('SELECT * FROM tickets WHERE guildId = ? AND userId = ?', [guildId, userId], async (err, row) => {
            if (err) {
                console.error(err);
                return;
            }

            

            const ticketChannel = await guild.channels.create({
                name: `ticket-${user.username}`,
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

            // Save ticket data to database
            const ticketId = `${guildId}-${ticketChannel.id}`;
            db.run('INSERT INTO tickets (id, channelId, guildId, userId) VALUES (?, ?, ?, ?)', [ticketId, ticketChannel.id, guildId, userId]);

            const ticketEmbed = new EmbedBuilder()
                .setTitle('Support Ticket')
                .setDescription(`Hello ${user}, please describe your issue.`)
                .setColor('#00FF00')
                .setTimestamp();

            await ticketChannel.send({ embeds: [ticketEmbed] });

            interaction.reply({ content: 'Ticket created!', ephemeral: true });
        });
    });
};
