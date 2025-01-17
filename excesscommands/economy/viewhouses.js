// commands/economy/viewhouses.js
const { buyHouse, getEconomyProfile, updateWallet } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

const houses = [
    { name: 'Small Apartment', price: 1000, monthlyRent: 100, utilities: 50 },
    { name: 'Family House', price: 5000, monthlyRent: 300, utilities: 150 },
    { name: 'Luxury Villa', price: 20000, monthlyRent: 1000, utilities: 500 },
];

module.exports = {
    name: 'viewhouses',
    description: 'View available houses to buy.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        if (profile.house) {
            return message.reply('You already own a property. Use `!sellhouse` before buying a new one.');
        }

        const embed = new EmbedBuilder()
            .setTitle('Available Houses')
            .setDescription(houses.map((house, index) => `${index + 1}. **${house.name}** - $${house.price}`).join('\n'))
            .setColor('#00FF00');
        
        message.channel.send({ embeds: [embed] });

        const filter = response => response.author.id === userId && /^[1-3]$/.test(response.content);
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000 });
        
        if (!collected.size) return message.reply('Time out. Please try again.');

        const choice = parseInt(collected.first().content) - 1;
        const selectedHouse = houses[choice];

        if (profile.wallet < selectedHouse.price) {
            return message.reply('You do not have enough money to buy this house.');
        }

        await buyHouse(userId, selectedHouse);
        await updateWallet(userId, -selectedHouse.price);

        message.reply(`You have successfully purchased a **${selectedHouse.name}**.`);
    },
};
