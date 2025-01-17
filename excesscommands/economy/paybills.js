// commands/economy/paybills.js
const { getEconomyProfile, updateBills, updateWallet, handleEviction } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'paybills',
    description: 'View and pay your outstanding bills.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        if (!profile.house) {
            return message.reply("You don't have any bills to pay since you don't own a property.");
        }

        const bills = profile.bills;
        const totalDue = bills.unpaidRent + bills.unpaidUtilities;
        if (totalDue === 0) {
            return message.reply("You have no unpaid bills.");
        }

        if (profile.wallet < totalDue) {
            return message.reply(`You don't have enough money to pay all bills. You need $${totalDue}, but you only have $${profile.wallet}.`);
        }

        await updateWallet(userId, -totalDue);
        await updateBills(userId, {
            rentDueDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            utilitiesDueDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            unpaidRent: 0,
            unpaidUtilities: 0
        });

        const embed = new EmbedBuilder()
            .setTitle('Bills Paid')
            .setDescription(`You have successfully paid a total of $${totalDue} in bills.`)
            .setColor('#00FF00');

        message.reply({ embeds: [embed] });
    },
};
