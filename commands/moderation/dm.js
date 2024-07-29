const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('dms a member in the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to dm')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Message here')
                .setRequired(true)),        
    async execute(interaction) {
        let sender = interaction.user; 
        let targetUser;
        let reason;
        if (interaction.isCommand && interaction.isCommand()) {
           
            targetUser = interaction.options.getUser('target');
            reason = interaction.options.getString('reason');
   
        const dmEmbed = new EmbedBuilder()
            .setTitle('Recievd a DM')
            .setDescription(`${sender} Sent You DM from ${interaction.guild.name} : ${reason}`)
            .setColor(0xff0000); 

        await targetUser.send({ embeds: [dmEmbed] });
              } else {
    const embed = new EmbedBuilder()
    .setColor('#3498db')
    .setAuthor({ 
        name: "Alert!", 
        iconURL: cmdIcons.dotIcon ,
        url: "https://discord.gg/xQF9f9yUEM"
    })
    .setDescription('- This command can only be used through slash command!\n- Please use `/dm` to DM a member.')
    .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    }   

    },
};
