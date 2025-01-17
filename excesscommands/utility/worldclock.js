const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'worldclock',
    description: lang.worldClockDescription,

    async execute(message, args) {
        try {
            const getTime = (timeZone) => {
                return new Date().toLocaleString("en-US", { timeZone: timeZone });
            };

            const gmt = getTime("Europe/London");
            const est = getTime("America/New_York");
            const pst = getTime("America/Los_Angeles");
            const cst = getTime("America/Mexico_City");
            const aest = getTime("Australia/Sydney");
            const awst = getTime("Australia/Perth");
            const kst = getTime("Asia/Seoul");
            const ist = getTime("Asia/Kolkata");

            const embed = new EmbedBuilder()
                .setTitle(lang.worldClockTitle)
                .setColor('#FFFF00')
                .addFields(
                    { name: lang.istFieldName, value: `${ist}\n(GMT+05:30)` },
                    { name: lang.gmtFieldName, value: `${gmt}\n(GMT+0/GMT+1)` },
                    { name: lang.estFieldName, value: `${est}\n(GMT-5)` },
                    { name: lang.pstFieldName, value: `${pst}\n(GMT-8)` },
                    { name: lang.cstFieldName, value: `${cst}\n(GMT-7)` },
                    { name: lang.aestFieldName, value: `${aest}\n(GMT+11)` },
                    { name: lang.kstFieldName, value: `${kst}\n(GMT+9)` }
                );

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error retrieving world clock:', error);
            message.reply(lang.worldClockErrorMessage);
        }
    },
};
