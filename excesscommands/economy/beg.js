const { getEconomyProfile, updateEconomyProfile } = require('../../models/economy');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'beg',
    description: 'Beg for some money.',
    async execute(message) {
        const userId = message.author.id;
        const profile = await getEconomyProfile(userId);

        const now = Date.now();
        const cooldown = 10 * 60 * 1000; 

        if (profile.lastBeg && now - profile.lastBeg < cooldown) {
            const remaining = cooldown - (now - profile.lastBeg);
            const remainingMinutes = Math.ceil(remaining / (60 * 1000));
            const embed = new EmbedBuilder()
                .setTitle('Begging Cooldown')
                .setDescription(`You have recently begged. Try again in ${remainingMinutes} minute(s).`)
                .setColor('#FF0000')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();
                
            return message.reply({ embeds: [embed] });
        }

        const earnings = Math.floor(Math.random() * (50 - 10 + 1)) + 10; 

        await updateEconomyProfile(userId, { 
            wallet: profile.wallet + earnings, 
            lastBeg: now 
        });

        const embed = new EmbedBuilder()
            .setTitle('Begging Successful')
            .setDescription(`You begged and received $${earnings}!`)
            .setColor('#00FF00')
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
