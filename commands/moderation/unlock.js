const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlockchannel')
        .setDescription('Unlocks the channel')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const channel = interaction.channel;
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: true  
        });

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription('The channel has been unlocked.');
        await interaction.reply({ embeds: [embed] });
    },
};