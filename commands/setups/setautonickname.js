const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { nicknameConfigs } = require('../../mongodb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnickgenre')
        .setDescription('Configure auto nickname changer.')
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('The prefix to add to nicknames.')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Enable or disable the auto nickname changer.')),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('You do not have permission to use this command.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        const guildId = interaction.guild.id;
        const prefix = interaction.options.getString('prefix');
        const status = interaction.options.getBoolean('status') ?? true; 

        await nicknameConfigs.updateOne(
            { guildId },
            { $set: { nicknamePrefix: prefix, status } },
            { upsert: true }
        );

        return interaction.reply({
            content: `Auto nickname changer has been ${status ? '**enabled**' : '**disabled**'} with prefix: **${prefix}**.`,
            ephemeral: true,
        });
        
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setautonickname`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
