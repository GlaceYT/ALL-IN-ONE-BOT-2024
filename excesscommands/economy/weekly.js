const { getEconomyProfile, updateEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'weekly',
    description: 'Claim your weekly reward.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        const now = Date.now();
        const cooldown = 7 * 24 * 60 * 60 * 1000;

        if (profile.lastWeekly && now - profile.lastWeekly < cooldown) {
            const remaining = cooldown - (now - profile.lastWeekly);
            const remainingDays = Math.ceil(remaining / (24 * 60 * 60 * 1000));
            const embed = new EmbedBuilder()
                .setTitle('Weekly Reward Cooldown')
                .setDescription(`You have already claimed your weekly reward. Try again in ${remainingDays} day(s).`)
                .setColor('#FF0000');
            return message.reply({ embeds: [embed] });
        }

        let baseReward = 1000;
        let reward = baseReward + (profile.dailyStreak * 100);
        const maxStreakBonus = 1000;
        if (reward > baseReward + maxStreakBonus) {
            reward = baseReward + maxStreakBonus;
        }

        await updateEconomyProfile(userId, { 
            wallet: profile.wallet + reward, 
            lastWeekly: now 
        });

        const embed = new EmbedBuilder()
            .setTitle('Weekly Reward')
            .setDescription(`You have received $${reward}!`)
            .setColor('#00FF00');

        message.reply({ embeds: [embed] });
    },
};
