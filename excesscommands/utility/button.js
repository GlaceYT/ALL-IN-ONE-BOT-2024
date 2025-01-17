const Discord = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
  name: 'button',
  description: lang.buttonDescription,

  async execute(message, args) {
    if (args.length < 2) {
      return message.reply(lang.buttonArgsError);
    }

    const text = args.shift();
    const url = args.join(' ');

    if (text.length > 50) {
      return message.reply(lang.buttonTextLengthError);
    }
    if (!isValidUrl(url)) {
      return message.reply(lang.buttonInvalidUrlError);
    }

    const button = new Discord.ButtonBuilder()
      .setLabel(text)
      .setURL(url)
      .setStyle(Discord.ButtonStyle.Link);

    const row = new Discord.ActionRowBuilder()
      .addComponents(button);

    const embed = new Discord.EmbedBuilder()
      .setTitle(`${lang.buttonTitlePrefix} ${text}`)
      .setDescription(lang.buttonDescriptionText);

    message.reply({ embeds: [embed], components: [row] });
  }
};

function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}
