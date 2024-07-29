const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greyscale')
        .setDescription('Apply a greyscale effect to a user\'s profile picture.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User whose profile picture to apply greyscale effect')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            await interaction.deferReply();

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: 'You must specify a user to apply the greyscale effect!' });
                }

                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const greyscaleImage = await canvafy.Image.greyscale(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle('Greyscale Effect')
                    .setDescription(`Here's a greyscale version of ${user}'s profile picture!`)
                    .setImage('attachment://greyscale-image.png') 
                    .setColor('#808080')
                    .setFooter({ text: `The world in shades of grey! 🌫️` });

                await interaction.editReply({ 
                    content: `Here's how ${user} looks in greyscale!`, 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(greyscaleImage, { name: 'greyscale-image.png' })] 
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
            // Handle prefix-based interactions
            const args = interaction.content.split(' ').slice(1);
            const user = interaction.mentions.users.first() || interaction.guild.members.cache.get(args[0])?.user;

            if (!user) {
                return interaction.reply({ content: 'You must mention a user to apply the greyscale effect!', ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const greyscaleImage = await canvafy.Image.greyscale(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle('Greyscale Effect')
                    .setDescription(`Here's a greyscale version of ${user}'s profile picture!`)
                    .setImage('attachment://greyscale-image.png') 
                    .setColor('#808080')
                    .setFooter({ text: `The world in shades of grey! 🌫️` });

                await interaction.reply({ 
                    content: `Here's how ${user} looks in greyscale!`, 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(greyscaleImage, { name: 'greyscale-image.png' })] 
                });
            } catch (error) {
                return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};
