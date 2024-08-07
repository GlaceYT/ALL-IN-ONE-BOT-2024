const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const lang = require('../../events/loadLanguage');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockchannel')
        .setDescription(lang.lockChannelCommandDescription)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription(lang.lockChannelNoPermission);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const channel = interaction.channel;
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: false  
        });

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(lang.lockChannelSuccess);
        await interaction.reply({ embeds: [embed] });
    },
};
