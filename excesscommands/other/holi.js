const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'holi',
    description: lang.holiDescription,
    execute(message, args) {
        let today = new Date();
        let holi = new Date(today.getFullYear(), 2, 29); 

       
        if (holi.getMonth() !== 2 || holi.getDate() !== 29) {
           
            holi = new Date(today.getFullYear(), 2, 1);
        }

       
        if (today.getMonth() > 2 || (today.getMonth() === 2 && today.getDate() > 29)) {
            holi.setFullYear(holi.getFullYear() + 1);
        }

        let one_day = 1000 * 60 * 60 * 24;
        let daysLeft = Math.ceil((holi.getTime() - today.getTime()) / one_day);

       
        const embed = new EmbedBuilder()
            .setTitle(lang.holiTitle)
            .setDescription(`${daysLeft} ${lang.holiCountdown}`)
            .setColor('#ff66b3'); 
       
        message.reply({ embeds: [embed] });
    },
};
