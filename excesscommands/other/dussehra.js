const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'dussehra',
    description: lang.dussehraDescription,
    execute(message, args) {
        let today = new Date();
        let dussehra = new Date(today.getFullYear(), 9, 15); 

       
        if (today.getMonth() === 9 && today.getDate() > 15) {
            dussehra.setFullYear(dussehra.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((dussehra.getTime() - today.getTime()) / one_day);

     
        const embed = new EmbedBuilder()
            .setTitle(lang.dussehraTitle)
            .setDescription(`${daysLeft} ${lang.dussehraCountdown}`)
            .setColor('#ff9933'); 

     
        message.reply({ embeds: [embed] });
    },
};
