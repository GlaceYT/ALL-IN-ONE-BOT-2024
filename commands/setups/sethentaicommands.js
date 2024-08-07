const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { hentaiCommandCollection } = require('../../mongodb'); 
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sethentaicommands')
        .setDescription('Enable or disable hentai commands')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Enable or disable hentai commands')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('You do not have permission to use this command.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        const status = interaction.options.getBoolean('status');
        const serverId = interaction.guild.id;

        if (status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide a valid status.', ephemeral: true });
        }

        const serverOwnerId = interaction.guild.ownerId;
        const memberId = interaction.user.id;

        
        const existingConfig = await hentaiCommandCollection.findOne({ serverId });
        const ownerId = existingConfig?.ownerId;

        if (memberId !== serverOwnerId && memberId !== ownerId) {
            return interaction.reply({ content: 'Only the server owner or specified owners can use this command.', ephemeral: true });
        }

       
        await hentaiCommandCollection.updateOne(
            { serverId },
            { $set: { serverId, status, ownerId: serverOwnerId } },
            { upsert: true }
        );

        interaction.reply({ content: `Hentai commands status updated successfully for server ID ${serverId}.`, ephemeral: true });

    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/sethentaicommands`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    }
};
