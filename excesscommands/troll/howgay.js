const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'howgay',
    description: 'Calculates your gay rate.',
    execute(message, args) {
      
        var result = Math.ceil(Math.random() * 100);

       
        const embed = new EmbedBuilder()
            .setTitle('🏳️‍🌈 Gay Rate')
            .setDescription(`You are ${result}% gay!`)
            .setColor('#ff69b4'); 

      
        message.reply({ embeds: [embed] });
    },
};
