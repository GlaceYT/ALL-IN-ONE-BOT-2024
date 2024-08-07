const { SlashCommandBuilder, EmbedBuilder  } = require('@discordjs/builders');
const canvafy = require('canvafy');
const lang = require('../../events/loadLanguage');
const { AttachmentBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription(lang.shipCommandDescription)
        .addUserOption(option =>
            option.setName('user1')
                .setDescription(lang.shipUser1Description)
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user2')
                .setDescription(lang.shipUser2Description)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();

            try {
                const user1 = interaction.options.getUser('user1');
                const user2 = interaction.options.getUser('user2');

                const shipPercentage = Math.floor(Math.random() * 101);

                const shipImage = await new canvafy.Ship()
                    .setAvatars(
                        user1.displayAvatarURL({ forceStatic: true, extension: 'png' }),
                        user2.displayAvatarURL({ forceStatic: true, extension: 'png' })
                    )
                    .setBackground('image', 'https://imgur.com/0vV4uCm.jpg')
                    .setBorder('#ffffff')
                    .setOverlayOpacity(0.5)
                    .setCustomNumber(shipPercentage)
                    .build();

                let color, message;
                if (shipPercentage <= 25) {
                    color = 0xFF0000; // Red
                    message = lang.shipLowMessage;
                } else if (shipPercentage <= 50) {
                    color = 0xFFA500; // Orange
                    message = lang.shipMediumMessage;
                } else if (shipPercentage <= 75) {
                    color = 0xFFFF00; // Yellow
                    message = lang.shipHighMessage;
                } else {
                    color = 0x00FF00; // Green
                    message = lang.shipVeryHighMessage;
                }
                

                const embed = new EmbedBuilder()
                    .setTitle(lang.shipEmbedTitle)
                    .setDescription(`${user1} ❤ ${user2}`)
                    .addFields(
                        { name: lang.shipPercentageFieldName, value: `${shipPercentage}%` },
                        { name: lang.shipMessageFieldName, value: message }
                    )
                    .setColor(color)
                    .setImage('attachment://ship-image.png')
                    .setFooter({ text: lang.shipFooterText });

                await interaction.editReply({
                    content: lang.shipReplyContent.replace('{user1}', user1).replace('{user2}', user2).replace('{shipPercentage}', shipPercentage),
                    embeds: [embed],
                    files: [new AttachmentBuilder(shipImage, { name: 'ship-image.png' })]
                });
            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    return interaction.followUp({ content: lang.shipErrorMessage, ephemeral: true });
                } else {
                    return interaction.reply({ content: lang.shipErrorMessage, ephemeral: true });
                }
            }
        } else {
            const mentions = interaction.mentions.users;
            if (mentions.size < 2) {
                return interaction.reply(lang.shipMentionErrorMessage);
            }

            const user1 = mentions.first();
            const user2 = mentions.at(1);

            try {
                const shipPercentage = Math.floor(Math.random() * 101);

                const shipImage = await new canvafy.Ship()
                    .setAvatars(
                        user1.displayAvatarURL({ forceStatic: true, extension: 'png' }),
                        user2.displayAvatarURL({ forceStatic: true, extension: 'png' })
                    )
                    .setBackground('image', 'https://imgur.com/0vV4uCm.jpg')
                    .setBorder('#ffffff')
                    .setOverlayOpacity(0.5)
                    .setCustomNumber(shipPercentage)
                    .build();

                let color, message;
                if (shipPercentage <= 25) {
                    color = 0xFF0000; // Red
                    message = lang.shipLowMessage;
                } else if (shipPercentage <= 50) {
                    color = 0xFFA500; // Orange
                    message = lang.shipMediumMessage;
                } else if (shipPercentage <= 75) {
                    color = 0xFFFF00; // Yellow
                    message = lang.shipHighMessage;
                } else {
                    color = 0x00FF00; // Green
                    message = lang.shipVeryHighMessage;
                }
                

                const embed = new EmbedBuilder()
                    .setTitle(lang.shipEmbedTitle)
                    .setDescription(`${user1} ❤ ${user2}`)
                    .addFields(
                        { name: lang.shipPercentageFieldName, value: `${shipPercentage}%` },
                        { name: lang.shipMessageFieldName, value: message }
                    )
                    .setColor(color)
                    .setImage('attachment://ship-image.png')
                    .setFooter({ text: lang.shipFooterText });

                await interaction.reply({
                    content: lang.shipReplyContent.replace('{user1}', user1).replace('{user2}', user2).replace('{shipPercentage}', shipPercentage),
                    embeds: [embed],
                    files: [new AttachmentBuilder(shipImage, { name: 'ship-image.png' })]
                });
            } catch (error) {
                return interaction.reply({ content: lang.shipErrorMessage, ephemeral: true });
            }
        }
    }
};
