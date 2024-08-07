const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beautiful')
        .setDescription(lang.beautifulDescription)
        .addUserOption(option => 
            option.setName('user')
                .setDescription(lang.beautifulUserDescription)
                .setRequired(true)),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
            await interaction.deferReply(); 

            try {
                const user = interaction.options.getUser('user');
                if (!user) {
                    return interaction.editReply({ content: lang.beautifulNoUser });
                }
                
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const beautifulImage = await canvafy.Image.beautiful(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.beautifulTitle)
                    .setDescription(lang.beautifulDescriptionText.replace('{user}', user))
                    .setImage('attachment://beautiful-image.png') 
                    .setColor('#FF69B4')
                    .setFooter({ text: lang.beautifulFooter });

                await interaction.editReply({ 
                    content: lang.beautifulReplyText.replace('{user}', user), 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(beautifulImage, { name: 'beautiful-image.png' })] 
                });
            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    return interaction.followUp({ content: lang.beautifulError, ephemeral: true });
                } else {
                    return interaction.reply({ content: lang.beautifulError, ephemeral: true });
                }
            }
        } else {
            const args = interaction.content.split(' ').slice(1);
            const user = interaction.mentions.users.first() || interaction.guild.members.cache.get(args[0])?.user;

            if (!user) {
                return interaction.reply({ content: lang.beautifulNoMention, ephemeral: true });
            }

            try {
                const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                const beautifulImage = await canvafy.Image.beautiful(userAvatarURL);

                const embed = new EmbedBuilder()
                    .setTitle(lang.beautifulTitle)
                    .setDescription(lang.beautifulDescriptionText.replace('{user}', user))
                    .setImage('attachment://beautiful-image.png') 
                    .setColor('#FF69B4')
                    .setFooter({ text: lang.beautifulFooter });

                await interaction.reply({ 
                    content: lang.beautifulReplyText.replace('{user}', user), 
                    embeds: [embed], 
                    files: [new AttachmentBuilder(beautifulImage, { name: 'beautiful-image.png' })] 
                });
            } catch (error) {
                return interaction.reply({ content: lang.beautifulError, ephemeral: true });
            }
        }
    }
};
