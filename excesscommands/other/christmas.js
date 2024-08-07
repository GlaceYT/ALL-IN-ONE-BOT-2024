const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'christmas',
    description: lang.christmasDescription,
    execute(message, args) {
        let today = new Date();
        let xmas = new Date(today.getFullYear(), 11, 25);

        if (today.getMonth() === 11 && today.getDate() > 25) {
            xmas.setFullYear(xmas.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((xmas.getTime() - today.getTime()) / one_day);

        const embed = new EmbedBuilder()
            .setTitle(lang.christmasTitle)
            .setDescription(`${daysLeft} ${lang.christmasCountdown}`)
            .setColor('#ff0000');

        message.reply({ embeds: [embed] });
    },
};
