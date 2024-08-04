const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const canvafy = require('canvafy');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Apply a delete effect to a user\'s profile picture.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User whose profile picture to beautify')
                .setRequired(true)),
    async execute(interaction) {
        
            if (interaction.isCommand && interaction.isCommand()) { 
                await interaction.deferReply(); 

                try {
                    const user = interaction.options.getUser('user');
                    if (!user) {
                        return interaction.editReply({ content: 'You must specify a user to beautify their profile picture!' });
                    }
                    
                    const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                    const deleteImage = await canvafy.Image.delete(userAvatarURL);

                    const embed = new EmbedBuilder()
                        .setTitle('delete Effect')
                        .setImage('attachment://delete-image.png') 
                        .setColor('#FF69B4');

                    await interaction.editReply({ 
                        content: `Here's how ${user} look on a delete card!`,  
                        embeds: [embed], 
                        files: [new AttachmentBuilder(deleteImage, { name: 'delete-image.png' })] 
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
                    return interaction.reply({ content: 'You must mention a user to beautify their profile picture!', ephemeral: true });
                }

                try {
                    const userAvatarURL = user.displayAvatarURL({ forceStatic: true, extension: 'png' });
                    const deleteImage = await canvafy.Image.delete(userAvatarURL);

                    const embed = new EmbedBuilder()
                        .setTitle('delete Effect')
                        .setImage('attachment://delete-image.png') 
                        .setColor('#FF69B4');

                    await interaction.reply({ 
                        content: `Here's how ${user} look on a delete card!`, 
                        embeds: [embed], 
                        files: [new AttachmentBuilder(deleteImage, { name: 'delete-image.png' })] 
                    });
                } catch (error) {
                    return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        
    }
};
