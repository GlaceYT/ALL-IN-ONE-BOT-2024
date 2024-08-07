const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('darkness')
        .setDescription(lang.darknessDescription)
        .addUserOption(option => 
            option.setName('user')
                .setDescription(lang.darknessUserDescription)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: lang.darknessNoUser });
                }

                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const darknessImage = await canvafy.Image.darkness(userAvatarURL, 100);

                const embed = new EmbedBuilder()
                    .setTitle(lang.darknessTitle)
                    .setDescription(`${lang.darknessDescriptionText} ${user}'s profile picture!`)
                    .setImage('attachment://darkness-image.png')
                    .setColor('#808080')
                    .setFooter({ text: lang.darknessFooter });

                await interaction.editReply({
                    content: `${lang.darknessResponseText} ${user}`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(darknessImage, { name: 'darkness-image.png' })]
                });
            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    return interaction.followUp({ content: lang.darknessError, ephemeral: true });
                } else {
                    return interaction.reply({ content: lang.darknessError, ephemeral: true });
                }
            }
        } else {
            const args = interaction.content.split(' ').slice(1);
            const user = interaction.mentions.users.first() || interaction.guild.members.cache.get(args[0])?.user;

            if (!user) {
                return interaction.reply({ content: lang.darknessNoUser, ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const darknessImage = await canvafy.Image.darkness(userAvatarURL, 100);

                const embed = new EmbedBuilder()
                    .setTitle(lang.darknessTitle)
                    .setDescription(`${lang.darknessDescriptionText} ${user}'s profile picture!`)
                    .setImage('attachment://darkness-image.png')
                    .setColor('#808080')
                    .setFooter({ text: lang.darknessFooter });

                await interaction.reply({
                    content: `${lang.darknessResponseText} ${user}`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(darknessImage, { name: 'darkness-image.png' })]
                });
            } catch (error) {
                return interaction.reply({ content: lang.darknessError, ephemeral: true });
            }
        }
    }
};
