const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('darkness')
        .setDescription('Apply a darkness effect to a user\'s profile picture.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User whose profile picture to darken')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: 'You must specify a user to darken their profile picture!' });
                }

                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const darknessImage = await canvafy.Image.darkness(userAvatarURL, 100);

                const embed = new EmbedBuilder()
                    .setTitle('Darkness Effect')
                    .setDescription(`Here's a darkened version of ${user}'s profile picture!`)
                    .setImage('attachment://darkness-image.png')
                     .setColor('#808080')
                    .setFooter({ text: 'Embrace the darkness! 🌑' });

                await interaction.editReply({
                    content: `Here's how ${user} looks with a darkness effect!`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(darknessImage, { name: 'darkness-image.png' })]
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
            const args = interaction.content.split(' ').slice(1);
            const user = interaction.mentions.users.first() || interaction.guild.members.cache.get(args[0])?.user;

            if (!user) {
                return interaction.reply({ content: 'You must mention a user to darken their profile picture!', ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const darknessImage = await canvafy.Image.darkness(userAvatarURL, 100);

                const embed = new EmbedBuilder()
                    .setTitle('Darkness Effect')
                    .setDescription(`Here's a darkened version of ${user}'s profile picture!`)
                    .setImage('attachment://darkness-image.png')
                     .setColor('#808080')
                    .setFooter({ text: 'Embrace the darkness! 🌑' });

                await interaction.reply({
                    content: `Here's how ${user} looks with a darkness effect!`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(darknessImage, { name: 'darkness-image.png' })]
                });
            } catch (error) {
                return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};
