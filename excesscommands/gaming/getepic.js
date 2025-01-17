const { EmbedBuilder } = require('discord.js');
const { getEpic } = require('../../models/epicData');

module.exports = {
    name: 'getepic',
    description: 'Gets the Epic Games name of yourself or the mentioned user.',
    async execute(message, args) {
     
        let user = message.mentions.users.first() || message.author;

        
        const epic = await getEpic(user.id);

     
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🎮 Epic Games Account')
            .setTimestamp()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

        if (epic) {
       
            embed.setDescription(`${user}'s Epic Games name : **${epic}**.`);
        } else {
     
            embed.setDescription(`${user} has not set their Epic Games name yet. ${user.id === message.author.id ? "You" : "They"} can set it using the \`!set-epic [EpicName]\` command.`);
        }

   
        return message.reply({ embeds: [embed] });
    }
};
