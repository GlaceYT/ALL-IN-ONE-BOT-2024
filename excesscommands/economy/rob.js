const { getEconomyProfile, updateEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rob',
    description: 'Attempt to rob another user.',
    async execute(message, args) {
        const userId = message.author.id;
        const target = message.mentions.users.first();
        
        if (!target) {
            const embed = new EmbedBuilder()
                .setTitle('User Not Mentioned')
                .setDescription('Please mention a user to rob.')
                .setColor('#FF0000');
            return message.channel.send({ embeds: [embed] });
        }

        if (target.id === userId) {
            const embed = new EmbedBuilder()
                .setTitle('Invalid Target')
                .setDescription('You cannot rob yourself!')
                .setColor('#FF0000');
            return message.channel.send({ embeds: [embed] });
        }

        const profile = await getEconomyProfile(userId);
        const targetProfile = await getEconomyProfile(target.id);

        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000;

        if (profile.lastRob && now - profile.lastRob < cooldown) {
            const remaining = cooldown - (now - profile.lastRob);
            const remainingHours = Math.ceil(remaining / (60 * 60 * 1000));
            const embed = new EmbedBuilder()
                .setTitle('Cooldown Active')
                .setDescription(`You have already attempted to rob someone. Try again in ${remainingHours} hour(s).`)
                .setColor('#FF0000');
            return message.channel.send({ embeds: [embed] });
        }

        if (targetProfile.wallet < 100) {
            const embed = new EmbedBuilder()
                .setTitle('Insufficient Funds')
                .setDescription(`${target.username} does not have enough money to rob.`)
                .setColor('#FF0000');
            return message.channel.send({ embeds: [embed] });
        }

        const successRate = 0.5;
        const success = Math.random() < successRate;

        if (success) {
            const amount = Math.floor(Math.random() * Math.min(500, targetProfile.wallet * 0.3)) + 1;
            const stolen = Math.min(amount, targetProfile.wallet);

            await updateEconomyProfile(userId, { 
                wallet: profile.wallet + stolen, 
                lastRob: now 
            });
            await updateEconomyProfile(target.id, { 
                wallet: targetProfile.wallet - stolen 
            });

            const embed = new EmbedBuilder()
                .setTitle('Robbery Successful')
                .setDescription(`You successfully robbed $${stolen} from ${target.username}!`)
                .setColor('#00FF00');
            message.channel.send({ embeds: [embed] });
        } else {
            const penalty = Math.floor(profile.wallet * 0.1);
            await updateEconomyProfile(userId, { 
                wallet: Math.max(profile.wallet - penalty, 0),
                lastRob: now 
            });

            const embed = new EmbedBuilder()
                .setTitle('Robbery Failed')
                .setDescription(`You failed to rob ${target.username} and lost $${penalty}.`)
                .setColor('#FF0000');
            message.channel.send({ embeds: [embed] });
        }
    },
};
