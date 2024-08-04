const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('Rates something randomly from 0 to 10')
        .addStringOption(option =>
            option.setName('thing')
                .setDescription('The thing to rate')
                .setRequired(true)),

    async execute(interaction) {
        let sender = interaction.user;
        let thingToRate;

        if (interaction.isCommand && interaction.isCommand()) {
        
            thingToRate = interaction.options.getString('thing');
        } else {
            
            const message = interaction;
            sender = message.author;
            const args = message.content.split(' ');
            args.shift(); 
            thingToRate = args.join(' ');
        }

    
        const rating = Math.floor(Math.random() * 11);

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('Rating Generator')
            .setDescription(`**${thingToRate}** is rated **${rating}/10**`)
            .setTimestamp();

        if (interaction.isCommand && interaction.isCommand()) {
         
            await interaction.reply({ embeds: [embed] });
        } else {
         
            await interaction.reply({ embeds: [embed] });
        }
    },
};
