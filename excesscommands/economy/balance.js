// commands/economy/balance.js
const { getEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'balance',
    aliases: ['bal'],
    description: 'Check your balance.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);


        const wallet = Number(profile.wallet ?? 1);  
        const bank = Number(profile.bank ?? 0);      

        const embed = new EmbedBuilder()
            .setTitle('Balance')
            .setDescription(`**Wallet:** $${wallet}\n**Bank:** $${bank}`)
            .setColor('#FF00FF')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
