const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { commandLogsCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcommandlogs')
        .setDescription('Set or disable a channel for logging command executions.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('The channel to send command execution logs.')
                .setRequired(false)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('You do not have permission to use this command.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        const { guild, options } = interaction;

        if (!guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        const channel = options.getChannel('channel');
        const guildId = guild.id;

        if (channel) {
            if (!channel.isTextBased()) {
                return interaction.reply({ content: 'Please select a text-based channel.', ephemeral: true });
            }

            await commandLogsCollection.updateOne(
                { guildId },
                { $set: { channelId: channel.id } },
                { upsert: true }
            );

            return interaction.reply({
                content: `Command execution logs will now be sent to <#${channel.id}>.`,
                ephemeral: true,
            });
        } else {
            await commandLogsCollection.deleteOne({ guildId });

            return interaction.reply({
                content: 'Command execution logs have been disabled for this server.',
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
        .setDescription('- This command can only be used through slash command!\n- Please use `/setcommandlogs`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
