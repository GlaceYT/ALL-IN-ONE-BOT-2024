const { EmbedBuilder } = require('discord.js');
const { getUserData } = require('../../models/users');

module.exports = {
    name: 'weeklyxp',
    description: 'Show how much XP you earned this week.',
    async execute(message, args) {
        try {
            const userData = await getUserData(message.author.id);

            if (!userData) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Could not retrieve user data. Please ensure you have some XP recorded.')
                    .setColor('#FF0000');
                return message.reply({ embeds: [embed] });
            }

            const weeklyXp = userData.weeklyXp;

            const embed = new EmbedBuilder()
                .setTitle('Weekly XP')
                .setDescription(`${message.author} : **${weeklyXp}** XP`)
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
