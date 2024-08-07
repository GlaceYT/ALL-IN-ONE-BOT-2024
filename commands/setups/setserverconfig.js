const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { serverConfigCollection } = require('../../mongodb'); 
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setserverconfig')
        .setDescription('Set the owner ID and prefix for a specific server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ownerid')
                .setDescription('The owner ID for the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('The prefix for the server')
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
        const ownerId = interaction.options.getString('ownerid');
        const prefix = interaction.options.getString('prefix');
        const guild = interaction.guild;

        const serverOwnerId = guild.ownerId;
        if (interaction.user.id !== serverOwnerId) {
            return interaction.reply({ content: 'Only the server owner can use this command.', ephemeral: true });
        }

        if (serverId !== guild.id) {
            return interaction.reply({ content: 'The server ID provided does not match the server ID of this server.', ephemeral: true });
        }

        if (!serverId || !ownerId || !prefix) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, owner ID, and prefix.', ephemeral: true });
        }

        try {
           
            await serverConfigCollection.updateOne(
                { serverId },
                { $set: { serverId, ownerId, prefix } },
                { upsert: true }
            );

            interaction.reply({ content: `Server-specific prefix and owner ID updated successfully for server ID ${serverId}.`, ephemeral: true });
        } catch (error) {
            console.error('Error saving server configuration:', error);
            interaction.reply({ content: 'There was an error saving the server configuration.', ephemeral: true });
        }
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setserverconfig`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    }
};
