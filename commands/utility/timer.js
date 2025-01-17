const { SlashCommandBuilder } = require('@discordjs/builders');
const { setTimeout } = require('timers/promises');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription(lang.timerDescription)
        .addIntegerOption(option => 
            option.setName('minutes')
                .setDescription('Time duration for the timer in minutes')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            const minutes = interaction.options.getInteger('minutes');
            const duration = minutes * 60000; 

            await interaction.reply(lang.timerSetMessage.replace('{minutes}', minutes));

            await setTimeout(duration);

            await interaction.followUp(lang.timerUpMessage.replace('{user}', interaction.user).replace('{minutes}', minutes));
        } else {
            const args = interaction.content.split(' ').slice(1);
            const minutes = parseInt(args[0], 10);

            if (isNaN(minutes)) {
                return interaction.reply(lang.invalidMinutes);
            }

            const duration = minutes * 60000;
            await interaction.reply(lang.timerSetMessage.replace('{minutes}', minutes));

            await setTimeout(duration);

            await interaction.reply(lang.timerUpMessage.replace('{user}', interaction.author).replace('{minutes}', minutes));
        }
    },
};
