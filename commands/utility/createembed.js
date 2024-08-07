const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createembed')
    .setDescription(lang.createembedDescription)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription(lang.createembedChannel)
        .setRequired(true))
    .addStringOption(option => 
      option.setName('color')
        .setDescription(lang.createembedColor)
        .setRequired(true))
    .addStringOption(option => 
      option.setName('title')
        .setDescription(lang.createembedTitle)
        .setRequired(true))
    .addStringOption(option => 
      option.setName('url')
        .setDescription(lang.createembedURL)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('author_name')
        .setDescription(lang.createembedAuthorName)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('author_icon')
        .setDescription(lang.createembedAuthorIcon)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('author_url')
        .setDescription(lang.createembedAuthorURL)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('description')
        .setDescription(lang.createembedDescriptionField)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('thumbnail')
        .setDescription(lang.createembedThumbnail)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('fields')
        .setDescription(lang.createembedFields)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('image')
        .setDescription(lang.createembedImage)
        .setRequired(false))
    .addBooleanOption(option => 
      option.setName('timestamp')
        .setDescription(lang.createembedTimestamp)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('footer_text')
        .setDescription(lang.createembedFooterText)
        .setRequired(false))
    .addStringOption(option => 
      option.setName('footer_icon')
        .setDescription(lang.createembedFooterIcon)
        .setRequired(false)),

  async execute(interaction) {
    if (interaction.isCommand && interaction.isCommand()) { 
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('You do not have permission to use this command.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
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
            return interaction.reply({ content: lang.createembedFieldsLimit, ephemeral: true });
          }
          embed.addFields(parsedFields);
        } catch (error) {
          console.error('Error parsing fields:', error);
          return interaction.reply({ content: lang.createembedParseError, ephemeral: true });
        }
      }
      if (image) embed.setImage(image);
      if (timestamp) embed.setTimestamp();
      if (footerText) embed.setFooter({ text: footerText, iconURL: footerIcon });

      try {
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: lang.createembedSuccess, ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: lang.createembedFailed, ephemeral: true });
      }

    } else {
      const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
          name: lang.createembedAlertTitle, 
          iconURL: cmdIcons.dotIcon ,
          url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription(lang.createembedAlertDescription)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    }  
  },
};
