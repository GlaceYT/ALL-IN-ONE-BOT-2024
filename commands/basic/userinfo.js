const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription(lang.userinfoDescription)
        .addUserOption(option => 
            option.setName('target')
                .setDescription(lang.userinfoTargetDescription)
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options?.getUser('target') || interaction.mentions?.users.first() || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id);

        const roles = member.roles.cache.filter(role => role.name !== '@everyone');
        const highestRole = member.roles.highest;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(lang.userinfoTitle)
            .setThumbnail(targetUser.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setDescription(`
                **${lang.userinfoUsername}:** ${targetUser.tag}
                **${lang.userinfoUserID}:** ${targetUser.id}
                **${lang.userinfoJoinedDiscord}:** ${targetUser.createdAt.toUTCString()}
                **${lang.userinfoJoinedServer}:** ${member.joinedAt.toUTCString()}
                **${lang.userinfoRoles}:** ${roles.map(role => role.name).join(', ') || lang.userinfoNone}
                **${lang.userinfoHighestRole}:** ${highestRole.name}
                **${lang.userinfoIsBot}:** ${targetUser.bot ? lang.userinfoYes : lang.userinfoNo}
            `)
            .setTimestamp();

        if (interaction.isCommand?.()) {
            // Slash command execution
            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            await interaction.reply({ embeds: [embed] });
        }
    }
};
