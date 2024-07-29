const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('friendship')
        .setDescription('Rates the friendship between you and another user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to rate friendship with')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
        await interaction.deferReply(); 

        const user = interaction.options.getUser('user');
        const friendshipRating = Math.floor(Math.random() * 101); 

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Friendship Rating')
            .setDescription(`${interaction.user} and ${user}'s friendship rating is **${friendshipRating}%**!`)
            .setFooter({ text: 'Friendship rating is just for fun!' });

        await interaction.editReply({ embeds: [embed] }); 
    } else {
        const mentions = interaction.mentions.users;
        if (mentions.size < 2) {
            return interaction.reply('Please tag two users to rate their friendship.');
        }

        const user1 = mentions.first();
        const user2 = mentions.at(1);
        const friendshipRating = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Friendship Rating')
            .setDescription(`${user1} and ${user2}'s friendship rating is **${friendshipRating}%**!`)
            .setFooter({ text: 'Friendship rating is just for fun!' });

        await interaction.reply({ embeds: [embed] });
    } 
    },
};