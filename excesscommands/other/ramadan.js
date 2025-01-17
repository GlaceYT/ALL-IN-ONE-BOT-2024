const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'ramadan',
    description: lang.ramadanDescription,
    execute(message, args) {
        let today = new Date();
        let ramadan = new Date(today.getFullYear(), 3, 12);

      
        if (today.getMonth() === 3 && today.getDate() >= 12) {
            ramadan.setFullYear(ramadan.getFullYear() + 1);
        } else if (today.getMonth() > 3) {
            ramadan.setFullYear(ramadan.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((ramadan.getTime() - today.getTime()) / one_day);

    
        const embed = new EmbedBuilder()
            .setTitle(lang.ramadanTitle)
            .setDescription(`${daysLeft} ${lang.ramadanCountdown}`)
            .setColor('#ffcc00'); 

       
        message.reply({ embeds: [embed] });
    },
};
