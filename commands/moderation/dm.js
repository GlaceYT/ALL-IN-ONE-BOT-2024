const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription(lang.dmCommandDescription)
        .addUserOption(option =>
            option.setName('target')
                .setDescription(lang.dmTargetDescription)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription(lang.dmReasonDescription)
                .setRequired(true)),
    async execute(interaction) {
        const sender = interaction.user;
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        const dmEmbed = new EmbedBuilder()
            .setTitle(lang.dmReceivedTitle)
            .setDescription(
                lang.dmReceivedDescription
                    .replace('${sender}', sender.tag)
                    .replace('${interaction.guild.name}', interaction.guild.name)
                    .replace('${reason}', reason)
            )
            .setColor(0xff0000);

        try {
         
            await targetUser.send({ embeds: [dmEmbed] });

         
            await interaction.reply({
                content: lang.dmSentConfirmation.replace('${targetUser}', targetUser.tag),
                flags: 64,
            });
        } catch (error) {
            console.error('Error sending DM:', error);

         
            await interaction.reply({
                content: lang.dmFailedMessage.replace('${targetUser}', targetUser.tag),
                flags: 64,
            });
        }
    },
};
