const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { ticketsCollection, voiceChannelCollection, nqnCollection, welcomeCollection, giveawayCollection, autoroleCollection, serverConfigCollection, antisetupCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showsetups')
        .setDescription('Displays the ticket, voice channel, NQN, welcome, auto-role, and anti setups for this server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const guildId = interaction.guild.id;

        try {
            // Fetching data from MongoDB collections
            const serverConfig = await serverConfigCollection.findOne({ serverId: guildId });
            const ticketSetup = await ticketsCollection.findOne({ serverId: guildId });
            const voiceChannelSetup = await voiceChannelCollection.findOne({ serverId: guildId });
            const nqnSetup = await nqnCollection.findOne({ serverId: guildId });
            const welcomeSetup = await welcomeCollection.findOne({ serverId: guildId });
            const autoroleSetup = await autoroleCollection.findOne({ serverId: guildId });
            const antiSetup = await antisetupCollection.findOne({ serverId: guildId });
            const activeGiveaways = await giveawayCollection.find({ channel: { $exists: true } }).toArray();
            const giveawayCount = activeGiveaways.length;

            const prefix = serverConfig?.prefix || 'Not Set';
            const embeds = [];

            // Main Embed for General Setups
            const mainEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Server Setups')
                .addFields({ name: 'Prefix', value: prefix, inline: true })
                .setTimestamp();

            // Ticket Setup
            if (ticketSetup) {
                mainEmbed.addFields(
                    { name: 'Ticket Setup', value: '\u200B' },
                    { name: 'Ticket Channel ID', value: ticketSetup.ticketChannelId || 'N/A', inline: true },
                    { name: 'Admin Role ID', value: ticketSetup.adminRoleId || 'N/A', inline: true },
                    { name: 'Active', value: ticketSetup.status ? 'Yes' : 'No', inline: true }
                );
            } else {
                mainEmbed.addFields({ name: 'Ticket Setup', value: 'No ticket setups found for this server.', inline: false });
            }

            // Voice Channel Setup
            if (voiceChannelSetup) {
                mainEmbed.addFields(
                    { name: 'Voice Channel Setup', value: '\u200B' },
                    { name: 'Voice Channel ID', value: voiceChannelSetup.voiceChannelId || 'N/A', inline: true },
                    { name: 'Manager Channel ID', value: voiceChannelSetup.managerChannelId || 'N/A', inline: true },
                    { name: 'Status', value: voiceChannelSetup.status ? 'Active' : 'Inactive', inline: true }
                );
            } else {
                mainEmbed.addFields({ name: 'Voice Channel Setup', value: 'No voice channel setups found for this server.', inline: false });
            }

            // NQN Setup
            if (nqnSetup) {
                mainEmbed.addFields(
                    { name: 'NQN Setup', value: '\u200B' },
                    { name: 'NQN Status', value: nqnSetup.status ? 'Active' : 'Inactive', inline: true }
                );
            } else {
                mainEmbed.addFields({ name: 'NQN Setup', value: 'NQN is not active for this server.', inline: false });
            }

            // Welcome Setup
            if (welcomeSetup) {
                mainEmbed.addFields(
                    { name: 'Welcome Setup', value: '\u200B' },
                    { name: 'Welcome Channel ID', value: welcomeSetup.welcomeChannelId || 'N/A', inline: true },
                    { name: 'Status', value: welcomeSetup.status ? 'Active' : 'Inactive', inline: true }
                );
            } else {
                mainEmbed.addFields({ name: 'Welcome Setup', value: 'No welcome setups found for this server.', inline: false });
            }

            // Auto-Role Setup
            if (autoroleSetup) {
                const role = interaction.guild.roles.cache.get(autoroleSetup.roleId);
                mainEmbed.addFields(
                    { name: 'Auto-Role Setup', value: '\u200B' },
                    { name: 'Role', value: role ? `${role.name} (${role.id})` : 'Role not found', inline: true },
                    { name: 'Status', value: autoroleSetup.status ? 'Active' : 'Inactive', inline: true }
                );
            } else {
                mainEmbed.addFields({ name: 'Auto-Role Setup', value: 'No auto-role setups found for this server.', inline: false });
            }

            // Active Giveaways
            if (activeGiveaways.length > 0) {
                mainEmbed.addFields(
                    { name: 'Active Giveaways', value: `Current number of giveaways: **${giveawayCount}**` }
                );
            } else {
                mainEmbed.addFields({ name: 'Active Giveaways', value: 'No active giveaways found.', inline: false });
            }

            embeds.push(mainEmbed);

            // Anti-Setup Details
            if (antiSetup) {
                const antiEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle('Anti-Setup Details')
                    .addFields(
                        { name: 'Anti-Spam', value: antiSetup.antiSpam?.enabled ? 'Enabled' : 'Disabled', inline: true },
                        { name: 'Message Count', value: antiSetup.antiSpam?.messageCount?.toString() || 'N/A', inline: true },
                        { name: 'Time Window', value: antiSetup.antiSpam?.timeWindow ? `${antiSetup.antiSpam.timeWindow / 1000} seconds` : 'N/A', inline: true },
                        { name: 'Action', value: antiSetup.antiSpam?.action || 'N/A', inline: true },
                        { name: 'Duration', value: antiSetup.antiSpam?.duration ? `${antiSetup.antiSpam.duration / 1000} seconds` : 'N/A', inline: true },

                        { name: 'Anti-Link', value: antiSetup.antiLink?.enabled ? 'Enabled' : 'Disabled', inline: true },
                        { name: 'Mode', value: antiSetup.antiLink?.mode || 'N/A', inline: true },
                        { name: 'Link Interval', value: antiSetup.antiLink?.linkInterval ? `${antiSetup.antiLink.linkInterval / 1000} seconds` : 'N/A', inline: true },

                        { name: 'Anti-Nuke', value: antiSetup.antiNuke?.enabled ? 'Enabled' : 'Disabled', inline: true },
                        { name: 'Channel Delete Limit', value: antiSetup.antiNuke?.channelDeleteLimit?.toString() || 'N/A', inline: true },
                        { name: 'Channel Delete Time', value: antiSetup.antiNuke?.channelDeleteTime ? `${antiSetup.antiNuke.channelDeleteTime / 1000} seconds` : 'N/A', inline: true },
                        { name: 'Member Kick Limit', value: antiSetup.antiNuke?.memberKickLimit?.toString() || 'N/A', inline: true },
                        { name: 'Member Ban Limit', value: antiSetup.antiNuke?.memberBanLimit?.toString() || 'N/A', inline: true },

                        { name: 'Anti-Raid', value: antiSetup.antiRaid?.enabled ? 'Enabled' : 'Disabled', inline: true },
                        { name: 'Join Limit', value: antiSetup.antiRaid?.joinLimit?.toString() || 'N/A', inline: true },
                        { name: 'Time Window', value: antiSetup.antiRaid?.timeWindow ? `${antiSetup.antiRaid.timeWindow / 1000} seconds` : 'N/A', inline: true },
                        { name: 'Action', value: antiSetup.antiRaid?.action || 'N/A', inline: true }
                    );

                embeds.push(antiEmbed);
            } else {
                embeds.push(new EmbedBuilder().setColor(0x0099ff).setTitle('Anti-Setup Details').setDescription('No anti-setup configurations found for this server.'));
            }

            // Send all embeds
            await interaction.reply({ embeds });

        } catch (error) {
            console.error('Error fetching setups:', error);
            await interaction.reply({ content: 'There was an error fetching the setups.', ephemeral: true });
        }
    }
};
