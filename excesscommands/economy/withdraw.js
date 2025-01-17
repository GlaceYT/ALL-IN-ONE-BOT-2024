// commands/economy/withdraw.js
const { getEconomyProfile, updateEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'withdraw',
    description: 'Withdraw money from your bank to your wallet.',
    usage: '<amount>',
    async execute(message, args) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);
        
        // Check if amount is provided
        if (!args[0]) {
            return message.reply('Please specify an amount to withdraw.');
        }

        // Parse amount and check if it’s a valid positive number
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please enter a valid positive number for the amount to withdraw.');
        }

        // Check if the user has enough funds in the bank
        if (profile.bank < amount) {
            return message.reply('You do not have enough funds in your bank to withdraw that amount.');
        }

        // Update the profile: subtract from bank, add to wallet
        await updateEconomyProfile(userId, {
            bank: profile.bank - amount,
            wallet: profile.wallet + amount,
        });

        const embed = new EmbedBuilder()
            .setTitle('Withdrawal Successful')
            .setDescription(`You have successfully withdrawn $${amount} from your bank to your wallet.`)
            .setColor('#00FF00')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
