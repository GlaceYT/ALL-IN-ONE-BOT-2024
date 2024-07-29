const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Checks the status of a member in the server')
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

        const member = await interaction.guild.members.fetch(targetUser.id);
        const status = member.presence?.status || 'offline';
        const activities = member.presence?.activities || [];
        const activityDescriptions = activities.map(activity => `${activity.type}: ${activity.name}`).join('\n') || 'None';

        const embed = new EmbedBuilder()
            .setTitle(`${targetUser.username}'s Status`)
            .setDescription(`**Status:** ${status}\n**Activities:**\n${activityDescriptions}`)
            .setColor(0x00ff00) 
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${sender.username}`, iconURL: sender.displayAvatarURL({ dynamic: true }) });

       
        await interaction.reply({ embeds: [embed] });
    },
};
