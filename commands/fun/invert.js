const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage');
const canvafy = require('canvafy');
const { AttachmentBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('invert')
        .setDescription(lang.invertDescription)
        .addUserOption(option => 
            option.setName('user')
                .setDescription(lang.invertUserDescription)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            await interaction.deferReply();

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: lang.invertUserError });
                }

                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const invertImage = await canvafy.Image.invert(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.invertTitle)
                    .setDescription(`${lang.invertDescriptionText} ${user}'s profile picture!`)
                    .setImage('attachment://invert-image.png') 
                    .setColor(0x0000FF)
                    .setFooter({ text: lang.invertFooter });

                await interaction.editReply({ 
                    content: `${lang.invertResponseText} ${user}`, 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(invertImage, { name: 'invert-image.png' })] 
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
                return interaction.reply({ content: lang.invertUserError, ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const invertImage = await canvafy.Image.invert(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.invertTitle)
                    .setDescription(`${lang.invertDescriptionText} ${user}'s profile picture!`)
                    .setImage('attachment://invert-image.png') 
                    .setColor(0x0000FF)
                    .setFooter({ text: lang.invertFooter });

                await interaction.reply({ 
                    content: `${lang.invertResponseText} ${user}`, 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(invertImage, { name: 'invert-image.png' })] 
                });
            } catch (error) {
                return interaction.reply({ content: lang.errorMessage, ephemeral: true });
            }
        }
    }
};
