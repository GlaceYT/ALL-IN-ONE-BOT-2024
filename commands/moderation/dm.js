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
        let sender = interaction.user; 
        let targetUser;
        let reason;
        if (interaction.isCommand && interaction.isCommand()) {
           
            targetUser = interaction.options.getUser('target');
            reason = interaction.options.getString('reason');
   
            const dmEmbed = new EmbedBuilder()
                .setTitle(lang.dmReceivedTitle)
                .setDescription(lang.dmReceivedDescription.replace('${sender}', sender).replace('${interaction.guild.name}', interaction.guild.name).replace('${reason}', reason))
                .setColor(0xff0000); 

            await targetUser.send({ embeds: [dmEmbed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: lang.dmAlert, 
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.dmOnlySlashCommand)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }   
    },
};
