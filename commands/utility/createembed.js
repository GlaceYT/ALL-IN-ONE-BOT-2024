const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createembed')
    .setDescription('Create and send an embed to a specified channel')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('The channel to send the embed to')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('color')
        .setDescription('The color of the embed (hex code)')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('title')
        .setDescription('The title of the embed')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('url')
        .setDescription('The URL of the embed')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('author_name')
        .setDescription('The name of the author')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('author_icon')
        .setDescription('The icon URL of the author')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('author_url')
        .setDescription('The URL of the author')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('description')
        .setDescription('The description of the embed')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('thumbnail')
        .setDescription('The thumbnail URL of the embed')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('fields')
        .setDescription('The fields of the embed in JSON format (max 25 fields)')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('image')
        .setDescription('The image URL of the embed')
        .setRequired(false))
    .addBooleanOption(option => 
      option.setName('timestamp')
        .setDescription('Whether to include a timestamp')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('footer_text')
        .setDescription('The text of the footer')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('footer_icon')
        .setDescription('The icon URL of the footer')
        .setRequired(false)),

  async execute(interaction) {
    if (interaction.isCommand && interaction.isCommand()) { 
    const channel = interaction.options.getChannel('channel');
    const color = interaction.options.getString('color');
    const title = interaction.options.getString('title');
    const url = interaction.options.getString('url');
    const authorName = interaction.options.getString('author_name');
    const authorIcon = interaction.options.getString('author_icon');
    const authorUrl = interaction.options.getString('author_url');
    const description = interaction.options.getString('description');
    const thumbnail = interaction.options.getString('thumbnail');
    const fields = interaction.options.getString('fields');
    const image = interaction.options.getString('image');
    const timestamp = interaction.options.getBoolean('timestamp');
    const footerText = interaction.options.getString('footer_text');
    const footerIcon = interaction.options.getString('footer_icon');

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title);

    if (url) embed.setURL(url);
    if (authorName) embed.setAuthor({ name: authorName, iconURL: authorIcon, url: authorUrl });
    if (description) embed.setDescription(description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) {
      try {
        const parsedFields = JSON.parse(fields);
        if (parsedFields.length > 25) {
          return interaction.reply({ content: 'You can only provide up to 25 fields.', ephemeral: true });
        }
        embed.addFields(parsedFields);
      } catch (error) {
        console.error('Error parsing fields:', error);
        return interaction.reply({ content: 'Error parsing fields. Please provide valid JSON.', ephemeral: true });
      }
    }
    if (image) embed.setImage(image);
    if (timestamp) embed.setTimestamp();
    if (footerText) embed.setFooter({ text: footerText, iconURL: footerIcon });

    try {
      await channel.send({ embeds: [embed] });
      await interaction.reply({ content: 'Embed sent successfully!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Failed to send embed.', ephemeral: true });
    }


  } else {
    const embed = new EmbedBuilder()
    .setColor('#3498db')
    .setAuthor({ 
        name: "Alert!", 
        iconURL: cmdIcons.dotIcon ,
        url: "https://discord.gg/xQF9f9yUEM"
    })
    .setDescription('- This command can only be used through slash command!\n- Please use `/createembed` to create an embed message.')
    .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    }  
  },
};
