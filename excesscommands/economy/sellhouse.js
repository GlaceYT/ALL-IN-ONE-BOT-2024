// commands/economy/sellhouse.js
const { sellHouse, getEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'sellhouse',
    description: 'Sell your current property.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        if (!profile.house) {
            return message.reply("You don't own a property to sell.");
        }

        await sellHouse(userId);

        const embed = new EmbedBuilder()
            .setTitle('House Sold')
            .setDescription(`You have successfully sold your **${profile.house.name}** and cleared all associated bills.`)
            .setColor('#00FF00');

        message.reply({ embeds: [embed] });
    },
};
