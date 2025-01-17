const { getEconomyProfile, updateEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    description: 'Deposit money into your bank.',
    async execute(message, args) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        const amount = parseInt(args[0], 10);

        if (isNaN(amount) || amount <= 0) {
            const embed = new EmbedBuilder()
                .setTitle('Invalid Amount')
                .setDescription('Please specify a valid amount to deposit.')
                .setColor('#FF0000')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();
            
            return message.channel.send({ embeds: [embed] });
        }

        if (amount > profile.wallet) {
            const embed = new EmbedBuilder()
                .setTitle('Insufficient Funds')
                .setDescription('You do not have enough money in your wallet.')
                .setColor('#FF0000')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        await updateEconomyProfile(userId, { 
            wallet: profile.wallet - amount,
            bank: profile.bank + amount 
        });

        const embed = new EmbedBuilder()
            .setTitle('Deposit Successful')
            .setDescription(`You have deposited $${amount} into your bank.`)
            .setColor('#00FF00')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
