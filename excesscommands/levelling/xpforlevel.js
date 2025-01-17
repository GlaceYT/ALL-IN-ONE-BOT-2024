const { EmbedBuilder } = require('discord.js');
const { getUserData } = require('../../models/users');

module.exports = {
    name: 'xpforlevel',
    description: 'Shows how much XP you need to reach the next level.',
    async execute(message, args) {
        try {
            const userId = message.author.id;
            const userData = await getUserData(userId);

            if (!userData) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('User data not found. Please ensure you have some XP recorded.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const currentLevel = userData.level;
            const currentXp = userData.xp;

            const xpForNextLevel = (currentLevel + 1) ** 2 * 100;
            const xpNeededForNextLevel = xpForNextLevel - currentXp;

            const embed = new EmbedBuilder()
                .setTitle('XP for Next Level')
                .setDescription(`${message.author} : **${xpNeededForNextLevel}** XP needed to reach the next level.`)
                .setColor('#00FF00');

            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('There was an error executing that command.')
                .setColor('#FF0000');
            message.reply({ embeds: [embed] });
        }
    }
};
