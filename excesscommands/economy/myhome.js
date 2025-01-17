// commands/economy/myhome.js
const { getEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'myhome',
    description: 'View your current property details, bills, and status.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        if (!profile.house) {
            return message.reply("You currently don't own a property. Use `!viewhouses` to see available properties.");
        }

        const bills = profile.bills;
        const rentDueDate = new Date(bills.rentDueDate).toLocaleDateString();
        const utilitiesDueDate = new Date(bills.utilitiesDueDate).toLocaleDateString();
        const unpaidTotal = bills.unpaidRent + bills.unpaidUtilities;

        const embed = new EmbedBuilder()
            .setTitle(`${profile.house.name} - Your Home`)
            .setDescription(`
                **Property**: ${profile.house.name}
                **Monthly Rent**: $${profile.house.monthlyRent}
                **Utilities Cost**: $${profile.house.utilities}
                **Rent Due Date**: ${rentDueDate}
                **Utilities Due Date**: ${utilitiesDueDate}
                **Unpaid Amount**: $${unpaidTotal}
                **Eviction Notice**: ${profile.evictionNotice ? '⚠️ Yes' : 'No'}
            `)
            .setColor(profile.evictionNotice ? '#FF0000' : '#00FF00')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
