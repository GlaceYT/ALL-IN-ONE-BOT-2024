const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Calculate the ship percentage between two users.')
        .addUserOption(option =>
            option.setName('user1')
                .setDescription('First user to ship')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user2')
                .setDescription('Second user to ship')
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

                let color, emoji, message;
                if (shipPercentage <= 25) {
                    color = '#FF0000';
                    emoji = ':broken_heart:';
                    message = "Maybe this ship is not meant to sail... :broken_heart:";
                } else if (shipPercentage <= 50) {
                    color = '#FFA500';
                    emoji = ':orange_heart:';
                    message = "There's some potential here... :orange_heart:";
                } else if (shipPercentage <= 75) {
                    color = '#FFFF00';
                    emoji = ':yellow_heart:';
                    message = "Looking good! There's definitely a spark! :yellow_heart:";
                } else {
                    color = '#00FF00';
                    emoji = ':green_heart:';
                    message = "It's a match made in heaven! :green_heart:";
                }

                const embed = new EmbedBuilder()
                    .setTitle('Ship Rate')
                    .setDescription(`${user1} ❤ ${user2}`)
                    .addFields(
                        { name: 'Ship Percentage', value: `${shipPercentage}%` },
                        { name: 'Message', value: message }
                    )
                    .setColor(color)
                    .setImage('attachment://ship-image.png')
                    .setFooter({ text: 'This ship rate is just for fun 😃' });

                await interaction.editReply({
                    content: `The ship percentage between ${user1} and ${user2} is ${shipPercentage}%!`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(shipImage, { name: 'ship-image.png' })]
                });
            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    return interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else {
            const mentions = interaction.mentions.users;
            if (mentions.size < 2) {
                return interaction.reply('Please tag two users to ship.');
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

                let color, emoji, message;
                if (shipPercentage <= 25) {
                    color = '#FF0000';
                    emoji = ':broken_heart:';
                    message = "Maybe this ship is not meant to sail... :broken_heart:";
                } else if (shipPercentage <= 50) {
                    color = '#FFA500';
                    emoji = ':orange_heart:';
                    message = "There's some potential here... :orange_heart:";
                } else if (shipPercentage <= 75) {
                    color = '#FFFF00';
                    emoji = ':yellow_heart:';
                    message = "Looking good! There's definitely a spark! :yellow_heart:";
                } else {
                    color = '#00FF00';
                    emoji = ':green_heart:';
                    message = "It's a match made in heaven! :green_heart:";
                }

                const embed = new EmbedBuilder()
                    .setTitle('Ship Rate')
                    .setDescription(`${user1} ❤ ${user2}`)
                    .addFields(
                        { name: 'Ship Percentage', value: `${shipPercentage}%` },
                        { name: 'Message', value: message }
                    )
                    .setColor(color)
                    .setImage('attachment://ship-image.png')
                    .setFooter({ text: 'This ship rate is just for fun 😃' });

                await interaction.reply({
                    content: `The ship percentage between ${user1} and ${user2} is ${shipPercentage}%!`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(shipImage, { name: 'ship-image.png' })]
                });
            } catch (error) {
                return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};
