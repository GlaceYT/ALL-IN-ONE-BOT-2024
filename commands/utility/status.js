const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription(lang.statusDescription)
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to check the status of')
                .setRequired(true)),
    async execute(interaction) {
        let sender = interaction.user; 
        let targetUser;

        if (interaction.isCommand && interaction.isCommand()) {
            targetUser = interaction.options.getUser('target');
        } else {
            const message = interaction;
            sender = message.author;
            targetUser = message.mentions.users.first();
        }

        try {
            const member = await interaction.guild.members.fetch(targetUser.id);
            const status = member.presence?.status || 'offline';
            const activities = member.presence?.activities || [];
            const activityDescriptions = activities.map(activity => `${activity.type}: ${activity.name}`).join('\n') || lang.noActivities;

            const embed = new EmbedBuilder()
                .setTitle(lang.statusTitle.replace('{username}', targetUser.username))
                .setDescription(`${lang.statusLabel.replace('{status}', status)}\n${lang.activitiesLabel.replace('{activities}', activityDescriptions)}`)
                .setColor(0x00ff00) 
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Requested by ${sender.username}`, iconURL: sender.displayAvatarURL({ dynamic: true }) });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            //console.error('Error fetching status:', error);
            await interaction.reply({ content: lang.errorFetchingStatus, ephemeral: true });
        }
    },
};
