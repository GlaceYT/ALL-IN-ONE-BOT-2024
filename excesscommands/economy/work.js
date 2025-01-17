const { getEconomyProfile, updateEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

const jobs = [
    { name: 'Lumberjack', min: 50, max: 100 },
    { name: 'Programmer', min: 150, max: 300 },
    { name: 'Chef', min: 100, max: 200 },
    { name: 'Delivery Person', min: 70, max: 150 },
    { name: 'Engineer', min: 200, max: 400 },
];

module.exports = {
    name: 'work',
    description: 'Work to earn some money.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        const now = Date.now();
        const cooldown = 1 * 60 * 60 * 1000;

        if (profile.lastWork && now - profile.lastWork < cooldown) {
            const remaining = cooldown - (now - profile.lastWork);
            const remainingMinutes = Math.ceil(remaining / (60 * 1000));
            const embed = new EmbedBuilder()
                .setTitle('Work Cooldown')
                .setDescription(`You have recently worked. Try again in ${remainingMinutes} minute(s).`)
                .setColor('#FF0000');
            return message.reply({ embeds: [embed] });
        }

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earnings = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

        await updateEconomyProfile(userId, { 
            wallet: profile.wallet + earnings, 
            lastWork: now
        });

        const embed = new EmbedBuilder()
            .setTitle('Work')
            .setDescription(`You worked as a **${job.name}** and earned $${earnings}!`)
            .setColor('#00FF00');

        message.reply({ embeds: [embed] });
    },
};
