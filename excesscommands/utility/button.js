const Discord = require('discord.js');

module.exports = {
  name: 'button',
  description: 'Create a clickable button.',

  async execute(message, args) {
 
    if (args.length < 2) {
      return message.reply("Please provide the button text and the link URL.");
    }

    const text = args.shift(); 
    const url = args.join(' '); 

  
    if (text.length > 50) {
      return message.reply("Your button text cannot be longer than 50 characters.");
    }
    if (!isValidUrl(url)) { 
      return message.reply("Please provide a valid URL.");
    }

    
    const button = new Discord.ButtonBuilder()
      .setLabel(text)
      .setURL(url)
      .setStyle(Discord.ButtonStyle.Link);

    const row = new Discord.ActionRowBuilder()
      .addComponents(button);


    const embed = new Discord.EmbedBuilder()
      .setTitle(`🔗 ${text}`)
      .setDescription(`Click the button to open the link!`);

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