const { setBirthday } = require('../../models/birthday');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'setbirthday',
    description: 'Set your birthday.',
    async execute(message, args) {
        const userId = message.author.id;

        if (args.length !== 1 || !/^\d{2}-\d{2}$/.test(args[0])) {
            const invalidFormatEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Invalid Format')
                .setDescription('Please provide your birthday in MM-DD format.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [invalidFormatEmbed] });
        }

        const birthday = args[0];
        await setBirthday(userId, birthday);

        const successEmbed = new EmbedBuilder()
            .setTitle('Birthday Set')
            .setDescription(`Your birthday has been set to **${birthday}**.`)
            .setColor('#00FF00')
            .setFooter({ text: `Action by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [successEmbed] });
    },
};
