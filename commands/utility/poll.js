const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll with options')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The poll question')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('options')
                .setDescription('The number of options (1-6)')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the poll to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('First option')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('Second option')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option3')
                .setDescription('Third option')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option4')
                .setDescription('Fourth option')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option5')
                .setDescription('Fifth option')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option6')
                .setDescription('Sixth option')
                .setRequired(false)),

    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const numOptions = interaction.options.getInteger('options');
        const options = [];
        for (let i = 1; i <= numOptions; i++) {
            const option = interaction.options.getString(`option${i}`);
            if (option) {
                options.push(option);
            }
        }
        const channel = interaction.options.getChannel('channel');

        // Default to Yes/No poll if no options provided
        if (options.length === 0) {
            options.push('Yes', 'No');
        }

        const embed = new EmbedBuilder()
            .setTitle(question)
            .setDescription(options.map((option, index) => `${index + 1}. ${option}`).join('\n'))
            .setColor('#FF00FF');

        try {
            const pollMessage = await channel.send({ embeds: [embed] });
            for (let i = 0; i < options.length; i++) {
                await pollMessage.react(`${i + 1}️⃣`);
            }
            await interaction.reply({ content: 'Poll created successfully!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error creating the poll.', ephemeral: true });
        }
    },
};
