const Discord = require('discord.js');

module.exports = {
  name: 'emoji',
  description: 'Emojify your text!',

  async execute(message, args) { 
    if (args.length === 0) {
      return message.reply("Please provide some text to emojify!");
    }

    const text = args.join(' '); 

    if (text.length > 4096) {
      return message.reply("Your emojify text cannot be longer than 4096 characters.");
    }

    const specialCodes = {
        '0': ':zero:',
        '1': ':one:',
        '2': ':two:',
        '3': ':three:',
        '4': ':four:',
        '5': ':five:',
        '6': ':six:',
        '7': ':seven:',
        '8': ':eight:',
        '9': ':nine:',
        '#': ':hash:',
        '*': ':asterisk:',
        '?': ':grey_question:',
        '!': ':grey_exclamation:',
        ' ': '   '
    };

    const emojified = text.toLowerCase().split('').map(letter => {
      if (/[a-z]/g.test(letter)) {
        return `:regional_indicator_${letter}:`;
      } else if (specialCodes[letter]) {
        return specialCodes[letter];
      }
      return letter;
    }).join('');

    const embed = new Discord.EmbedBuilder()
      .setTitle('🙂 Emojify')
      .setDescription(emojified);

    message.reply({ embeds: [embed] }); 
  }
};