const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    name: 'rpc',
    description: lang.rpcDescription,
    execute(message, args) {
        const choices = ['rock', 'paper', 'scissors'];

        const randomIndex = Math.floor(Math.random() * choices.length);
        const randomChoice = choices[randomIndex];

        const embed = new EmbedBuilder()
            .setTitle(lang.rpcTitle)
            .setDescription(`${lang.rpcBotChoice} **${randomChoice}**!`)
            .setColor('#00FF00'); 

        message.reply({ embeds: [embed] });
    },
};
