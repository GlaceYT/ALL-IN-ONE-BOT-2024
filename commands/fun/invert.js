const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invert')
        .setDescription('Apply an invert effect to a user\'s profile picture.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User whose profile picture to apply invert effect')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            await interaction.deferReply();

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: 'You must specify a user to apply the invert effect!' });
                }

                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const invertImage = await canvafy.Image.invert(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle('Invert Effect')
                    .setDescription(`Here's an inverted version of ${user}'s profile picture!`)
                    .setImage('attachment://invert-image.png') 
                     .setColor('#808080')
                    .setFooter({ text: `Seeing things in reverse! 🔄` });

                await interaction.editReply({ 
                    content: `Here's how ${user} looks with the invert effect!`, 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(invertImage, { name: 'invert-image.png' })] 
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
                return interaction.reply({ content: 'You must mention a user to apply the invert effect!', ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const invertImage = await canvafy.Image.invert(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle('Invert Effect')
                    .setDescription(`Here's an inverted version of ${user}'s profile picture!`)
                    .setImage('attachment://invert-image.png') 
                     .setColor('#808080')
                    .setFooter({ text: `Seeing things in reverse! 🔄` });

                await interaction.reply({ 
                    content: `Here's how ${user} looks with the invert effect!`, 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(invertImage, { name: 'invert-image.png' })] 
                });
            } catch (error) {
                return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};
