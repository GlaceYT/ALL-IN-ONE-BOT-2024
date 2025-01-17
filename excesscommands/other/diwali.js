const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'diwali',
    description: lang.diwaliDescription,
    execute(message, args) {
        let today = new Date();
        let diwali = new Date(today.getFullYear(), 10, 4);

        
        if (today.getMonth() === 10 && today.getDate() > 4) {
            diwali.setFullYear(diwali.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((diwali.getTime() - today.getTime()) / one_day);

       
        const embed = new EmbedBuilder()
            .setTitle(lang.diwaliTitle)
            .setDescription(`${daysLeft} ${lang.diwaliCountdown}`)
            .setColor('#ffcc00'); 

        message.reply({ embeds: [embed] });
    },
};
