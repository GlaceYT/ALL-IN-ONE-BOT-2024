const Discord = require('discord.js');
const generator = require('generate-password');
const lang = require('../../events/loadLanguage');

module.exports = {
  name: 'password',
  description: lang.passwordDescription,

  async execute(message, args) {
    const password = generator.generate({
      length: 12,
      symbols: true,
      numbers: true
    });

    message.reply(lang.passwordSentMessage);

    try {
      const dmEmbed = new Discord.EmbedBuilder()
        .setTitle(lang.passwordTitle)
        .addFields(
          { name: lang.passwordFieldLabel, value: `${password}`, inline: true },
          { name: lang.passwordLengthLabel, value: `12`, inline: true }
        );

      await message.author.send({ embeds: [dmEmbed] });
    } catch (error) {
      console.error("Error sending DM:", error);
      message.reply(lang.passwordDMError);
    }
  }
};
