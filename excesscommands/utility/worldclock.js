const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'worldclock',
    description: 'Displays current time in various timezones.',
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
                .setTitle('⏰ World Clock')
                .setColor('#FFFF00')
                .addFields(
                    { name: ':flag_in: India (IST)', value: `${ist}\n(GMT+05:30)` },
                    { name: ':flag_eu: London (GMT)', value: `${gmt}\n(GMT+0/GMT+1)` },
                    { name: ':flag_us: New York (EST)', value: `${est}\n(GMT-5)` },
                    { name: ':flag_us: Los Angeles (PST)', value: `${pst}\n(GMT-8)` },
                    { name: ':flag_us: Mexico City (CST)', value: `${cst}\n(GMT-7)` },
                    { name: ':flag_au: Sydney (AEST)', value: `${aest}\n(GMT+11)` },
                    { name: ':flag_kr: Seoul (KST)', value: `${kst}\n(GMT+9)` },
                    
                );

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error retrieving world clock:', error);
            message.reply('There was an error while retrieving the world clock data.');
        }
    },
};
