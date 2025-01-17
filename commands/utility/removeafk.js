const { SlashCommandBuilder } = require('discord.js');
const afkHandler = require('../../events/afkHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeafk')
        .setDescription('Remove your AFK status'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
    
        const { removeAFK, getAFK } = afkHandler(interaction.client);

        const afk = await getAFK(interaction.user.id, interaction.guild.id);

        if (!afk) {
            return interaction.reply({ content: 'You are not currently AFK.', ephemeral: true });
        }

        await removeAFK(interaction.user.id, interaction.guild.id);

        await interaction.reply({ content: 'Your AFK status has been removed.', ephemeral: true });

       
        await interaction.user.send('Your AFK status has been removed.').catch(console.error);
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/removeafk`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
