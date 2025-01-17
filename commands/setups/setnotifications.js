const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { notificationsCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnotifications')
        .setDescription('Manage notifications for YouTube, Twitch, Facebook, and Instagram.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Set up notifications for a platform.')
                .addStringOption(option =>
                    option.setName('platform')
                        .setDescription('The platform to set up notifications for.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'YouTube', value: 'youtube' },
                            { name: 'Twitch', value: 'twitch' },
                            { name: 'Facebook', value: 'facebook' },
                            { name: 'Instagram', value: 'instagram' },
                        ))
                .addStringOption(option =>
                    option.setName('platform_id')
                        .setDescription('YouTube Channel ID, Twitch Channel ID, Facebook Channel ID, or Instagram Account ID.')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('discord_channel')
                        .setDescription('The Discord channel for notifications.')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('mention_role')
                        .setDescription('The primary role to mention for notifications.')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('additional_roles')
                        .setDescription('Comma-separated list of additional roles to mention (IDs).')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View all current notification setups for a platform.')
                .addStringOption(option =>
                    option.setName('platform')
                        .setDescription('The platform to view notifications for.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'YouTube', value: 'youtube' },
                            { name: 'Twitch', value: 'twitch' },
                            { name: 'Facebook', value: 'facebook' },
                            { name: 'Instagram', value: 'instagram' },
                        ))),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('You do not have permission to use this command.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        const subcommand = interaction.options.getSubcommand();
        const platform = interaction.options.getString('platform');
        const guildId = interaction.guild.id;

        if (subcommand === 'setup') {
            const platformId = interaction.options.getString('platform_id');
            const discordChannel = interaction.options.getChannel('discord_channel');
            const mentionRole = interaction.options.getRole('mention_role');
            const additionalRoles = interaction.options.getString('additional_roles');

            if (!discordChannel.isTextBased()) {
                return interaction.reply({
                    content: 'Please select a text-based channel for notifications.',
                    ephemeral: true,
                });
            }

         
            const additionalRoleIds = additionalRoles
                ? additionalRoles.split(',').map(role => role.trim()).filter(roleId => interaction.guild.roles.cache.has(roleId))
                : [];

        
            const mentionRoles = mentionRole ? [mentionRole.id, ...additionalRoleIds] : additionalRoleIds;

            try {
                await notificationsCollection.updateOne(
                    { guildId, type: platform, platformId },
                    {
                        $set: {
                            discordChannelId: discordChannel.id,
                            mentionRoles,
                            lastNotifiedId: null, 
                        },
                    },
                    { upsert: true }
                );

                const embed = new EmbedBuilder()
                    .setTitle(`${platform.charAt(0).toUpperCase() + platform.slice(1)} Notifications Setup`)
                    .setDescription(`Successfully set up ${platform} notifications!`)
                    .addFields(
                        { name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} ID`, value: platformId },
                        { name: 'Discord Channel', value: `<#${discordChannel.id}>` },
                        { name: 'Mention Roles', value: mentionRoles.length > 0 ? mentionRoles.map(role => `<@&${role}>`).join(', ') : 'None' }
                    )
                    .setColor('#00FF00');

                return interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                console.error('Error setting up notifications:', error);
                return interaction.reply({
                    content: 'An error occurred while setting up notifications. Please try again later.',
                    ephemeral: true,
                });
            }
        }

        if (subcommand === 'view') {
            try {
                const configs = await notificationsCollection.find({ guildId, type: platform }).toArray();

                if (configs.length === 0) {
                    return interaction.reply({
                        content: `No ${platform} notifications have been set up for this server.`,
                        ephemeral: true,
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle(`${platform.charAt(0).toUpperCase() + platform.slice(1)} Notifications`)
                    .setDescription(`Here are the current ${platform} notification setups:`)
                    .setColor('#00FFFF');

                configs.forEach(config => {
                    embed.addFields({
                        name: `Platform ID: ${config.platformId}`,
                        value: `Channel: <#${config.discordChannelId}>\nRoles: ${
                            config.mentionRoles && config.mentionRoles.length > 0
                                ? config.mentionRoles.map(role => `<@&${role}>`).join(', ')
                                : 'None'
                        }`,
                    });
                });

                return interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                console.error('Error fetching notifications:', error);
                return interaction.reply({
                    content: 'An error occurred while fetching notifications. Please try again later.',
                    ephemeral: true,
                });
            }

        } else {
            const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setAuthor({ 
                name: "Alert!", 
                iconURL: cmdIcons.dotIcon ,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setDescription('- This command can only be used through slash command!\n- Please use `/setnotifications`')
            .setTimestamp();
        
            await interaction.reply({ embeds: [embed] });
        
            }  
        }
    },
};
