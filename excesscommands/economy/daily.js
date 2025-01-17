const { getEconomyProfile, updateEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'daily',
    description: 'Claim your daily reward.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; 

        if (profile.lastDaily && now - profile.lastDaily < cooldown) {
            const remaining = cooldown - (now - profile.lastDaily);
            const remainingHours = Math.ceil(remaining / (60 * 60 * 1000));
            const embed = new EmbedBuilder()
                .setTitle('Daily Reward Cooldown')
                .setDescription(`You have already claimed your daily reward. Try again in ${remainingHours} hour(s).`)
                .setColor('#FF0000')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

      
        let baseReward = 100;
        let reward = baseReward + (profile.dailyStreak * 10); 
        const maxStreakBonus = 500; 
        if (reward > baseReward + maxStreakBonus) {
            reward = baseReward + maxStreakBonus;
        }

        // Update streak
        let newStreak = 1;
        if (profile.lastDaily && now - profile.lastDaily < cooldown + 1 * 60 * 1000) {
            newStreak = profile.dailyStreak + 1;
        }

        await updateEconomyProfile(userId, { 
            wallet: profile.wallet + reward, 
            lastDaily: now,
            dailyStreak: newStreak
        });

        const embed = new EmbedBuilder()
            .setTitle('Daily Reward')
            .setDescription(`You have received $${reward}! Current streak: ${newStreak}`)
            .setColor('#00FF00')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
