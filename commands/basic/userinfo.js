const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Show detailed information about a user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id);

        const roles = member.roles.cache.filter(role => role.name !== '@everyone');
        const highestRole = member.roles.highest;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('👤 User Info')
            .setThumbnail(targetUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setDescription(`
                **Username:** ${targetUser.tag}
                **User ID:** ${targetUser.id}
                **Joined Discord:** ${targetUser.createdAt.toUTCString()}
                **Joined Server:** ${member.joinedAt.toUTCString()}
                **Roles:** ${roles.map(role => role.name).join(', ') || 'None'}
                **Highest Role:** ${highestRole.name}
                **Is Bot:** ${targetUser.bot ? 'Yes' : 'No'}
            `)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
