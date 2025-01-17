const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { autoroleCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setautorole')
        .setDescription('Set the auto-role for a server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('roleid')
                .setDescription('The ID of the role to be assigned')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('The status of the auto-role')
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
        const roleId = interaction.options.getString('roleid');
        const status = interaction.options.getBoolean('status');
        const guild = interaction.guild;

        if (serverId !== guild.id) {
            return interaction.reply({ content: 'The server ID provided does not match the server ID of this server.', ephemeral: true });
        }

        if (!serverId || !roleId || status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, role ID, and status.', ephemeral: true });
        }

        const serverOwnerId = interaction.guild.ownerId;
        const memberId = interaction.user.id;
        const ownerId = (await autoroleCollection.findOne({ serverId }))?.ownerId;

        if (memberId !== serverOwnerId && memberId !== ownerId) {
            return interaction.reply({ content: 'Only the server owner or specified owners can use this command.', ephemeral: true });
        }

        await autoroleCollection.updateOne(
            { serverId },
            {
                $set: {
                    serverId,
                    roleId,
                    status,
                    ownerId: serverOwnerId
                }
            },
            { upsert: true }
        );

        interaction.reply({ content: `Auto-role updated successfully for server ID ${serverId}`, ephemeral: true });

    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setautorole`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  

    }


};
