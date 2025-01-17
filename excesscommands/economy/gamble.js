const { getEconomyProfile, updateWallet } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'gamble',
    description: 'Gamble your money for a chance to win more!',
    async execute(message, args) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            const embed = new EmbedBuilder()
                .setTitle('Invalid Amount')
                .setDescription('Please provide a valid amount to gamble.')
                .setColor('#FF0000');
            return message.channel.send({ embeds: [embed] });
        }

        if (profile.wallet < amount) {
            const embed = new EmbedBuilder()
                .setTitle('Insufficient Funds')
                .setDescription('You don\'t have enough money in your wallet.')
                .setColor('#FF0000');
            return message.channel.send({ embeds: [embed] });
        }

        const winChance = Math.random();
        let resultMessage;
        let embedColor;

        if (winChance < 0.5) {
            await updateWallet(userId, -amount);
            resultMessage = `You gambled **$${amount}** and lost it all! Better luck next time.`;
            embedColor = '#FF0000';
        } else {
            const winnings = amount * 2;
            await updateWallet(userId, winnings);
            resultMessage = `You gambled **$${amount}** and won **$${winnings}**! Congratulations!`;
            embedColor = '#00FF00';
        }

        const embed = new EmbedBuilder()
            .setTitle('Gamble Result')
            .setDescription(resultMessage)
            .setColor(embedColor);

        message.channel.send({ embeds: [embed] });
    },
};
