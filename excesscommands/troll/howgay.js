const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'howgay',
    description: lang.howgayDescription,
    execute(message, args) {
        var result = Math.ceil(Math.random() * 100);

        const embed = new EmbedBuilder()
            .setTitle(lang.howgayTitle)
            .setDescription(`${lang.howgayDescriptionText} ${result}%!`)
            .setColor('#ff69b4');

        message.reply({ embeds: [embed] });
    },
};
