const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const lang = require('../../events/loadLanguage');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnickname')
        .setDescription(lang.setnicknameCommandDescription)
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
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription(lang.setnicknamePrefixError)
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
            .setDescription(lang.setnicknameNoNickname);
        return interaction.reply({ embeds: [embed] });
    }

    const member = interaction.guild.members.cache.get(targetUser.id);

    if (!member) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(lang.setnicknameMemberNotFound);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.manageable) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(lang.setnicknameCannotChange.replace('{target}', targetUser.tag));
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(lang.setnicknameNoPermission);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
        await member.setNickname(nickname);

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(lang.setnicknameSuccess.replace('{target}', targetUser.tag).replace('{nickname}', nickname));
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(lang.setnicknameFailed);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
