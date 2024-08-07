const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage');
const canvafy = require('canvafy');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gay')
        .setDescription(lang.gayDescription)
        .addUserOption(option => 
            option.setName('user')
                .setDescription(lang.gayUserDescription)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: lang.gayUserError });
                }

                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const gayImage = await canvafy.Image.gay(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.gayTitle)
                    .setDescription(`${lang.gayDescriptionText} ${user}'s profile picture!`)
                    .setImage('attachment://gay-image.png')
                    .setColor(0x0000FF)
                    .setFooter({ text: lang.gayFooter });

                await interaction.editReply({
                    content: `${lang.gayResponseText} ${user}`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(gayImage, { name: 'gay-image.png' })]
                });
            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    return interaction.followUp({ content: lang.errorMessage, ephemeral: true });
                } else {
                    return interaction.reply({ content: lang.errorMessage, ephemeral: true });
                }
            }
        } else {
            const args = interaction.content.split(' ').slice(1);
            const user = interaction.mentions.users.first() || interaction.guild.members.cache.get(args[0])?.user;

            if (!user) {
                return interaction.reply({ content: lang.gayUserError, ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const gayImage = await canvafy.Image.gay(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.gayTitle)
                    .setDescription(`${lang.gayDescriptionText} ${user}'s profile picture!`)
                    .setImage('attachment://gay-image.png')
                    .setColor(0x0000FF)
                    .setFooter({ text: lang.gayFooter });

                await interaction.reply({
                    content: `${lang.gayResponseText} ${user}`,
                    embeds: [embed],
                    files: [new AttachmentBuilder(gayImage, { name: 'gay-image.png' })]
                });
            } catch (error) {
                return interaction.reply({ content: lang.errorMessage, ephemeral: true });
            }
        }
    }
};
