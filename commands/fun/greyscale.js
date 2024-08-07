const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage');
const canvafy = require('canvafy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greyscale')
        .setDescription(lang.greyscaleDescription)
        .addUserOption(option => 
            option.setName('user')
                .setDescription(lang.greyscaleUserDescription)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            await interaction.deferReply();

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: lang.greyscaleUserError });
                }

                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const greyscaleImage = await canvafy.Image.greyscale(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.greyscaleTitle)
                    .setDescription(`${lang.greyscaleDescriptionText} ${user}'s profile picture!`)
                    .setImage('attachment://greyscale-image.png') 
                    .setColor('#808080')
                    .setFooter({ text: lang.greyscaleFooter });

                await interaction.editReply({ 
                    content: `${lang.greyscaleResponseText} ${user}`, 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(greyscaleImage, { name: 'greyscale-image.png' })] 
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
                return interaction.reply({ content: lang.greyscaleUserError, ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const greyscaleImage = await canvafy.Image.greyscale(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.greyscaleTitle)
                    .setDescription(`${lang.greyscaleDescriptionText} ${user}'s profile picture!`)
                    .setImage('attachment://greyscale-image.png') 
                    .setColor('#808080')
                    .setFooter({ text: lang.greyscaleFooter });

                await interaction.reply({ 
                    content: `${lang.greyscaleResponseText} ${user}`, 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(greyscaleImage, { name: 'greyscale-image.png' })] 
                });
            } catch (error) {
                return interaction.reply({ content: lang.errorMessage, ephemeral: true });
            }
        }
    }
};
