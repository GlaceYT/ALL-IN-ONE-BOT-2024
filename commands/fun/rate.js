const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const lang = require('../../events/loadLanguage'); // Adjust the path as needed

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription(lang.rateCommandDescription)
        .addStringOption(option =>
            option.setName('thing')
                .setDescription(lang.rateOptionDescription)
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
            .setColor(0x0000FF)
            .setTitle(lang.rateTitle)
            .setDescription(lang.rateDescription
                .replace('{thingToRate}', thingToRate)
                .replace('{rating}', rating))
            .setTimestamp();

        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }
    },
};
