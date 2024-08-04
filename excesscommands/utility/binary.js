const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'binary',
    description: 'Encode or decode text to/from binary.',
    async execute(message, args) {
        if (args.length < 2) {
            return message.reply('Please provide whether you want to encode or decode, and the text.');
        }

        const operation = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        let result = '';

        if (operation === 'encode') {
            result = text.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
        } else if (operation === 'decode') {
            result = text.split(' ').map(binary => String.fromCharCode(parseInt(binary, 2))).join('');
        } else {
            return message.reply('Invalid operation. Please use `encode` or `decode`.');
        }

        const embed = new EmbedBuilder()
            .setTitle('Binary Encode/Decode')
            .setDescription(`Operation: **${operation}**\nText: \`\`\`${text}\`\`\`\nResult: \`\`\`${result}\`\`\``);

        message.reply({ embeds: [embed] });
    },
};
