const Discord = require('discord.js');

module.exports = {
  name: 'button',
  description: 'Create a clickable button.',

  async execute(message, args) {
    // Check if enough arguments were provided
    if (args.length < 2) {
      return message.reply("Please provide the button text and the link URL.");
    }

    const text = args.shift(); // Remove the first argument (button text)
    const url = args.join(' '); // Combine remaining arguments into URL

    // Input Validation
    if (text.length > 50) {
      return message.reply("Your button text cannot be longer than 50 characters.");
    }
    if (!isValidUrl(url)) { // Add a URL validation function (see below)
      return message.reply("Please provide a valid URL.");
    }

    // Create Button and Action Row
    const button = new Discord.ButtonBuilder()
      .setLabel(text)
      .setURL(url)
      .setStyle(Discord.ButtonStyle.Link);

    const row = new Discord.ActionRowBuilder()
      .addComponents(button);

    // Send the Message with the Button
    const embed = new Discord.EmbedBuilder()
      .setTitle(`🔗 ${text}`)
      .setDescription(`Click the button to open the link!`);

    message.reply({ embeds: [embed], components: [row] });
  }
};

// Helper Function for URL Validation (Optional)
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false; 
  }
}