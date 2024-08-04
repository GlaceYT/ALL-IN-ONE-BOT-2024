const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnickname')
        .setDescription('Set a new nickname for a member')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to set nickname')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('The new nickname')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames), 
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
      
            await executeSlashCommand(interaction);
        } else {
     
            const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setAuthor({ 
                name: "Alert!", 
                iconURL: cmdIcons.dotIcon ,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setDescription('- This command can only be used through slash command!\n- Please use `/setnickname` to change nick name of a member.')
            .setTimestamp();
        
            await interaction.reply({ embeds: [embed] });
        
            }   
    },
};

async function executeSlashCommand(interaction) {
    const sender = interaction.user;
    const targetUser = interaction.options.getUser('target');
    const nickname = interaction.options.getString('nickname');

    await handleSetNickname(interaction, sender, targetUser, nickname);
}


async function handleSetNickname(interaction, sender, targetUser, nickname) {

    if (!nickname) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('Please provide a nickname.');
        return interaction.reply({ embeds: [embed] });
    }


    const member = interaction.guild.members.cache.get(targetUser.id);


    if (!member) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('Member not found.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }


    if (!member.manageable) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(`I cannot change the nickname of ${targetUser.tag}!`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('You do not have permission to use this command.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
  
        await member.setNickname(nickname);

      
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(`Nickname of ${targetUser.tag} has been set to ${nickname}.`);
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
   
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('Failed to set the nickname. Please try again later.');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
