const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription(lang.supportDescription),
    async execute(interaction) {
        const supportServerLink = lang.supportServerLink;
        const githubLink = lang.githubLink;
        const replitLink = lang.replitLink;
        const youtubeLink = lang.youtubeLink;

        const embed = new EmbedBuilder()
            .setColor('#b300ff')
            .setAuthor({
                name: lang.supportTitle,
                iconURL: lang.supportIconURL,
                url: supportServerLink
            })
            .setDescription(`
                ➡️ **${lang.supportDescriptionTitle}:**
                - ${lang.discord} - ${supportServerLink}
                
                ➡️ **${lang.followUsOn}:**
                - ${lang.github} - ${githubLink}
                - ${lang.replit} - ${replitLink}
                - ${lang.youtube} - ${youtubeLink}
            `)
            .setImage(lang.supportImageURL)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
