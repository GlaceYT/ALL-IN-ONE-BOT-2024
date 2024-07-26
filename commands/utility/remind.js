const { SlashCommandBuilder } = require('@discordjs/builders');
const { setTimeout } = require('timers/promises');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Set a reminder with a task')
        .addIntegerOption(option => 
            option.setName('minutes')
                .setDescription('Time duration for the reminder in minutes')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('task')
                .setDescription('Task to be reminded about')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const minutes = interaction.options.getInteger('minutes');
            const task = interaction.options.getString('task');
            const duration = minutes * 60000; // Convert to milliseconds

            await interaction.reply(`I'll remind you about "${task}" in ${minutes} minutes.`);

            // Wait for the specified time
            await setTimeout(duration);

            await interaction.followUp(`${interaction.user}, this is your reminder: "${task}"`);
        } else {
            // Prefix command execution
            const args = interaction.content.split(' ').slice(1);
            const minutes = parseInt(args[0], 10);
            const task = args.slice(1).join(' ');

            if (isNaN(minutes) || !task) {
                return interaction.reply('Please provide a valid number of minutes and a task.');
            }

            const duration = minutes * 60000; // Convert to milliseconds
            await interaction.reply(`I'll remind you about "${task}" in ${minutes} minutes.`);

            // Wait for the specified time
            await setTimeout(duration);

            await interaction.reply(`${interaction.author}, this is your reminder: "${task}"`);
        }
    },
};
