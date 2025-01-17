const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Make a customizable announcement.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where the announcement will be sent.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the announcement.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the announcement.')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('mention_role')
                .setDescription('The role to mention in the announcement.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('non_embed_content')
                .setDescription('Text to include before the embed (e.g., additional notes).')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('author_name')
                .setDescription('The author name for the embed.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('author_icon_url')
                .setDescription('The author icon URL.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('author_url')
                .setDescription('The URL for the author.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('The footer text for the embed.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer_icon_url')
                .setDescription('The footer icon URL.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color of the embed in hex format (e.g., #ff5733).')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('fields')
                .setDescription('Fields for the embed (format: "name:value|name:value|...").')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image_url')
                .setDescription('The URL for the image in the embed.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('thumbnail_url')
                .setDescription('The URL for the thumbnail in the embed.')
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
        const mentionRole = interaction.options.getRole('mention_role');
        const nonEmbedContent = interaction.options.getString('non_embed_content');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const authorName = interaction.options.getString('author_name');
        const authorIconUrl = interaction.options.getString('author_icon_url');
        const authorUrl = interaction.options.getString('author_url');
        const footer = interaction.options.getString('footer');
        const footerIconUrl = interaction.options.getString('footer_icon_url');
        const color = interaction.options.getString('color') || '#ffffff';
        const fieldsInput = interaction.options.getString('fields');
        const imageUrl = interaction.options.getString('image_url');
        const thumbnailUrl = interaction.options.getString('thumbnail_url');

        if (!channel.isTextBased()) {
            return interaction.reply({ content: 'The selected channel is not a text channel.', ephemeral: true });
        }

        const embed = new EmbedBuilder().setColor(color);

        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (authorName) embed.setAuthor({ name: authorName, iconURL: authorIconUrl, url: authorUrl });
        if (footer) embed.setFooter({ text: footer, iconURL: footerIconUrl });
        if (imageUrl) embed.setImage(imageUrl);
        if (thumbnailUrl) embed.setThumbnail(thumbnailUrl);

        if (fieldsInput) {
            const fields = fieldsInput.split('|').map(field => {
                const [name, value] = field.split(':');
                return { name: name?.trim(), value: value?.trim(), inline: false };
            });

            if (fields.length > 25) {
                return interaction.reply({
                    content: 'You can only include up to 25 fields in an embed.',
                    ephemeral: true,
                });
            }

            embed.addFields(fields);
        }

        const components = [];
        if (mentionRole) {
            components.push(`${mentionRole}`);
        }

      
        await channel.send({
            content: `${components.join(' ')} ${nonEmbedContent || ''}`.trim(),
            embeds: [embed],
        });

       
        await interaction.reply({ content: 'Announcement sent successfully!', ephemeral: true });
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/announce`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
