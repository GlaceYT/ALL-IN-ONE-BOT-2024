const { EmbedBuilder } = require('discord.js');
const { setEpic } = require('../../models/epicData');

module.exports = {
    name: 'setepic',
    description: 'Sets your Epic Games account name.',
    async execute(message, args) {
        if (args.length < 1) {
            return message.reply('Please provide your Epic Games name.');
        }

        const epic = args.join(' ');
        await setEpic(message.author.id, epic);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🎮 Epic Games Account Set')
            .setDescription(`Your Epic Games name has been set to **${epic}**.`)
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        return message.channel.send({ embeds: [embed] });
    }
};
