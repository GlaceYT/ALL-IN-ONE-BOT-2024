const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription(lang.deleteDescription)
        .addUserOption(option => 
            option.setName('user')
                .setDescription(lang.deleteUserDescription)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: lang.deleteNoUser });
                }

                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const deleteImage = await canvafy.Image.delete(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.deleteTitle)
                    .setImage('attachment://delete-image.png')
                    .setColor(0x0000FF);

                await interaction.editReply({
                    content: `${lang.deleteResponseText} ${user}`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(deleteImage, { name: 'delete-image.png' })]
                });
            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    return interaction.followUp({ content: lang.deleteError, ephemeral: true });
                } else {
                    return interaction.reply({ content: lang.deleteError, ephemeral: true });
                }
            }
        } else {
            const args = interaction.content.split(' ').slice(1);
            const user = interaction.mentions.users.first() || interaction.guild.members.cache.get(args[0])?.user;

            if (!user) {
                return interaction.reply({ content: lang.deleteNoUser, ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const deleteImage = await canvafy.Image.delete(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.deleteTitle)
                    .setImage('attachment://delete-image.png')
                    .setColor(0x0000FF);

                await interaction.reply({
                    content: `${lang.deleteResponseText} ${user}`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(deleteImage, { name: 'delete-image.png' })]
                });
            } catch (error) {
                return interaction.reply({ content: lang.deleteError, ephemeral: true });
            }
        }
    }
};
