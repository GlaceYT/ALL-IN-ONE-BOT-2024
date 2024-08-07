const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'say',
    description: lang.sayDescription,
    async execute(message, args) {
        if (!args.length) {
            return message.reply(lang.sayNoTextError);
        }

        try {
            await message.delete();
        } catch (error) {
            console.error('Error deleting message:', error);
            return message.reply(lang.sayDeleteError);
        }

        const text = args.join(' ');
        message.channel.send(text);
    },
};
