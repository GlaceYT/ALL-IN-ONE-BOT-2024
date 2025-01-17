const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { nqnCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnqnstatus')
        .setDescription('Set the NQN status for a server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Enable or disable NQN')
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
        const status = interaction.options.getBoolean('status');
        const guild = interaction.guild;

        if (serverId !== guild.id) {
            return interaction.reply({ content: 'The server ID provided does not match the server ID of this server.', ephemeral: true });
        }

        if (!serverId || status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide a valid server ID and status.', ephemeral: true });
        }

        const serverOwnerId = guild.ownerId;
        const memberId = interaction.user.id;
        const ownerId = (await nqnCollection.findOne({ serverId }))?.ownerId;

        if (memberId !== serverOwnerId && memberId !== ownerId) {
            return interaction.reply({ content: 'Only the server owner or specified owners can use this command.', ephemeral: true });
        }

        await nqnCollection.updateOne(
            { serverId },
            {
                $set: {
                    serverId,
                    status,
                    ownerId: serverOwnerId
                }
            },
            { upsert: true }
        );

        interaction.reply({ content: `NQN status updated successfully for server ID ${serverId}.`, ephemeral: true });
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setnqnstatus`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    }
};
