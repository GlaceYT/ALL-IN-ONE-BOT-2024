const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { serverLevelingLogsCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlevellogs')
        .setDescription('Set the channel for leveling logs')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addStringOption(option =>
            option.setName('channelid')
                .setDescription('The ID of the leveling logs channel')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const channelId = interaction.options.getString('channelid');
        const serverId = interaction.guild.id;

    
        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) {
            return interaction.reply({ content: 'Invalid channel ID. Please provide a valid channel ID from this server.', ephemeral: true });
        }

        try {
          
            await serverLevelingLogsCollection.updateOne(
                { serverId },
                { $set: { levelLogsChannelId: channelId } },
                { upsert: true }
            );

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(`Leveling logs have been successfully set to <#${channelId}>.`);
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error setting leveling logs:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('An error occurred while setting the leveling logs channel. Please try again later.');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setlevellogs`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
