const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { voiceChannelCollection } = require('../../mongodb');
const { sendOrUpdateCentralizedEmbed, loadConfig } = require('../../events/voiceChannelHandler');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setvoicechannelsetup')
        .setDescription('Set the voice channel for a server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('voicechannelid')
                .setDescription('The ID of the main voice channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('managerchannelid')
                .setDescription('The ID of the manager channel')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('The status of the voice channel setup')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('You do not have permission to use this command.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        const serverId = interaction.options.getString('serverid');
        const voiceChannelId = interaction.options.getString('voicechannelid');
        const managerChannelId = interaction.options.getString('managerchannelid');
        const status = interaction.options.getBoolean('status');
        const guild = interaction.guild;

        if (serverId !== guild.id) {
            return interaction.reply({ content: 'The server ID provided does not match the server ID of this server.', ephemeral: true });
        }

        if (!serverId || !voiceChannelId || !managerChannelId || status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, voice channel ID, manager channel ID, and status.', ephemeral: true });
        }

        const serverOwnerId = interaction.guild.ownerId;
        const memberId = interaction.user.id;
        const ownerId = (await voiceChannelCollection.findOne({ serverId }))?.ownerId;

        if (memberId !== serverOwnerId && memberId !== ownerId) {
            return interaction.reply({ content: 'Only the server owner or specified owners can use this command.', ephemeral: true });
        }

        await voiceChannelCollection.updateOne(
            { serverId },
            {
                $set: {
                    serverId,
                    voiceChannelId,
                    managerChannelId,
                    status,
                    ownerId: serverOwnerId
                }
            },
            { upsert: true }
        );

        await loadConfig();  // Reload the config after updating the database
        await sendOrUpdateCentralizedEmbed(interaction.client, guild);  // Send the centralized embed to the new channel

        interaction.reply({ content: `Voice channel setup updated successfully for server ID ${serverId}.`, ephemeral: true });
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setvoicechannelsetup`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    }
};
