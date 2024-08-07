const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription(lang.warnDescription)
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
                .setDescription(lang.warnNoPermission);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        if (interaction.isCommand && interaction.isCommand()) {
            targetUser = interaction.options.getUser('target');
            reason = interaction.options.getString('reason');
        } else {
            const message = interaction;
            sender = message.author;
            targetUser = message.mentions.users.first();
            const args = message.content.split(' ');
            args.shift(); 
            reason = args.join(' ');
        }

        const embed = new EmbedBuilder()
            .setDescription(lang.warnSuccess
                .replace('{sender}', sender.tag)
                .replace('{target}', targetUser.tag)
                .replace('{reason}', reason))
            .setColor(0xffcc00); 

        await interaction.reply({ embeds: [embed] });

        const dmEmbed = new EmbedBuilder()
            .setTitle(lang.warnDmTitle)
            .setDescription(lang.warnDmDescription
                .replace('{sender}', sender.tag)
                .replace('{guildName}', interaction.guild.name)
                .replace('{reason}', reason))
            .setColor(0xff0000); 

        await targetUser.send({ embeds: [dmEmbed] });
    },
};
