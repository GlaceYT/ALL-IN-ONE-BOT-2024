const { SlashCommandBuilder } = require('@discordjs/builders');
const { setTimeout } = require('timers/promises');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription(lang.remindDescription)
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
            const minutes = interaction.options.getInteger('minutes');
            const task = interaction.options.getString('task');
            const duration = minutes * 60000;

            await interaction.reply(lang.remindSuccess.replace('{task}', task).replace('{minutes}', minutes));

            await setTimeout(duration);

            await interaction.followUp(lang.remindFollowUp.replace('{user}', interaction.user).replace('{task}', task));
        } else {
            const args = interaction.content.split(' ').slice(1);
            const minutes = parseInt(args[0], 10);
            const task = args.slice(1).join(' ');

            if (isNaN(minutes) || !task) {
                return interaction.reply(lang.remindInvalidInput);
            }

            const duration = minutes * 60000;
            await interaction.reply(lang.remindSuccess.replace('{task}', task).replace('{minutes}', minutes));

            await setTimeout(duration);

            await interaction.reply(lang.remindFollowUp.replace('{user}', interaction.author).replace('{task}', task));
        }
    },
};
