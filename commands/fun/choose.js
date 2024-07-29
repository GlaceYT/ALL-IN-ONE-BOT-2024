const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Randomly chooses one item from the provided options')
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Options separated by commas')
                .setRequired(true)),

    async execute(interaction) {
        let sender = interaction.user;
        let options;

        if (interaction.isCommand && interaction.isCommand()) {
         
            options = interaction.options.getString('options').split(',');
        } else {
         
            const message = interaction;
            sender = message.author;
            const args = message.content.split(' ');
            args.shift(); 
            options = args.join(' ').split(',');
        }

      
        options = options.map(option => option.trim());

        let chosenOption;
        if (options.length === 1 && options[0].includes(' ')) {
        
            options = options[0].split(' ');
            chosenOption = options[Math.floor(Math.random() * options.length)];
        } else {
     
            chosenOption = options[Math.floor(Math.random() * options.length)];
        }

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('Random Choice Generator')
            .setDescription(`**Options:** ${options.join(', ')}\n**Chosen Option:** ${chosenOption}`)
            .setTimestamp();

        if (interaction.isCommand && interaction.isCommand()) {
        
            await interaction.reply({ embeds: [embed] });
        } else {
          
            await interaction.reply({ embeds: [embed] });
        }
    },
};
