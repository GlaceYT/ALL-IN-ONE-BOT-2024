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
            // Slash command execution
            options = interaction.options.getString('options').split(',');
        } else {
            // Prefix command execution
            const message = interaction;
            sender = message.author;
            const args = message.content.split(' ');
            args.shift(); // Remove the command name
            options = args.join(' ').split(',');
        }

        // Trim and clean up the options
        options = options.map(option => option.trim());

        // Choose a random option
        let chosenOption;
        if (options.length === 1 && options[0].includes(' ')) {
            // If options are provided as a single string separated by spaces
            options = options[0].split(' ');
            chosenOption = options[Math.floor(Math.random() * options.length)];
        } else {
            // Normal case: options are already split into array
            chosenOption = options[Math.floor(Math.random() * options.length)];
        }

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle('Random Choice Generator')
            .setDescription(`**Options:** ${options.join(', ')}\n**Chosen Option:** ${chosenOption}`)
            .setTimestamp();

        if (interaction.isCommand && interaction.isCommand()) {
            // Reply to slash command interaction
            await interaction.reply({ embeds: [embed] });
        } else {
            // Reply to prefix command interaction
            await interaction.reply({ embeds: [embed] });
        }
    },
};
