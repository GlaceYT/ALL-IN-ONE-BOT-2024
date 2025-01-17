const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'binary',
    description: lang.binaryDescription,
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply(lang.binaryArgsError);
        }

        const operation = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        let result = '';

        if (operation === 'encode') {
            result = text.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
        } else if (operation === 'decode') {
            result = text.split(' ').map(binary => String.fromCharCode(parseInt(binary, 2))).join('');
        } else {
            return message.reply(lang.binaryInvalidOperationError);
        }

        const embed = new EmbedBuilder()
            .setTitle(lang.binaryTitle)
            .setDescription(`${lang.binaryOperation}: **${operation}**\n${lang.binaryText}: \`\`\`${text}\`\`\`\n${lang.binaryResult}: \`\`\`${result}\`\`\``);

        message.reply({ embeds: [embed] });
    },
};
