const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a member in the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),        
    async execute(interaction) {
        let sender = interaction.user; 
        let targetUser;
        let reason;
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            targetUser = interaction.options.getUser('target');
            reason = interaction.options.getString('reason');
        } else {
            // Prefix command execution
            const message = interaction;
            sender = message.author;
            targetUser = message.mentions.users.first();
            const args = message.content.split(' ');
            args.shift(); // Remove the command name
            reason = args.join(' ');
        }

        const embed = new EmbedBuilder()
            .setDescription(`${sender} has warned ${targetUser} for: ${reason}`)
            .setColor(0xffcc00); // Yellow color

        // Send warning message to the channel
        await interaction.reply({ embeds: [embed] });

        // Send DM to the warned user
        const dmEmbed = new EmbedBuilder()
            .setTitle('You have been warned!')
            .setDescription(`You have received a warning from ${sender} in ${interaction.guild.name} for: ${reason}`)
            .setColor(0xff0000); // Red color

        await targetUser.send({ embeds: [dmEmbed] });
    },
};
