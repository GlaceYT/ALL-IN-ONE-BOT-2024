const { removeBirthday } = require('../../models/birthday');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'removebirthday',
    description: 'Remove your birthday from the system.',
    async execute(message) {
        const userId = message.author.id;

        await removeBirthday(userId);

        const embed = new EmbedBuilder()
            .setTitle('Birthday Removed')
            .setDescription('Your birthday has been removed from the system.')
            .setColor('#FF0000')
            .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
