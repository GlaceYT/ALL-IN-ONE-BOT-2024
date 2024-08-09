const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8-ball a question')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question you want to ask')
                .setRequired(true)),
    
    async execute(interaction) {
        const responses = [
            "🎱 It is certain.",
            "🎱 It is decidedly so.",
            "🎱 Without a doubt.",
            "🎱 Yes – definitely.",
            "🎱 You may rely on it.",
            "🎱 As I see it, yes.",
            "🎱 Most likely.",
            "🎱 Outlook good.",
            "🎱 Yes.",
            "🎱 Signs point to yes.",
            "🎱 Absolutely.",
            "🎱 Certainly.",
            "🎱 Sure thing.",
            "🎱 Of course.",
            "🎱 Definitely.",
            "🎱 For sure.",
            "🎱 Yes, indeed.",
            "🎱 You got it.",
            "🎱 Affirmative.",
            "🎱 Positively.",
            "🎱 Unquestionably.",
            "🎱 Indubitably.",
            "🎱 Sure.",
            "🎱 Yes, for certain.",
            "🎱 It looks good.",
            "🎱 Most certainly.",
            "🎱 Indeed.",
            "🎱 Yep.",
            "🎱 Naturally.",
            "🎱 Without hesitation.",
            "🎱 Definitely yes.",
            "🎱 All signs say yes.",
            "🎱 Certainly so.",
            "🎱 Absolutely yes.",
            "🎱 For sure yes.",
            "🎱 Most positively.",
            "🎱 Undoubtedly yes.",
            "🎱 Beyond a doubt.",
            "🎱 Yes, clearly.",
            "🎱 Yes, undoubtedly.",
            "🎱 Yes, without question.",
            "🎱 Yes, without a doubt.",
            "🎱 Yes, most assuredly.",
            "🎱 Yes, most definitely.",
            "🎱 Yes, absolutely.",
            "🎱 Yes, for sure.",
            "🎱 Yes, certainly.",
            "🎱 Yes, indeed.",
            "🎱 Yes, naturally.",
            "🎱 Yes, unquestionably.",
            "🎱 Reply hazy, try again.",
            "🎱 Ask again later.",
            "🎱 Better not tell you now.",
            "🎱 Cannot predict now.",
            "🎱 Concentrate and ask again.",
            "🎱 Don't count on it.",
            "🎱 My reply is no.",
            "🎱 My sources say no.",
            "🎱 Outlook not so good.",
            "🎱 Very doubtful.",
            "🎱 No way.",
            "🎱 I don't think so.",
            "🎱 Definitely not.",
            "🎱 Not a chance.",
            "🎱 No.",
            "🎱 Absolutely not.",
            "🎱 Certainly not.",
            "🎱 No, indeed.",
            "🎱 No, for sure.",
            "🎱 No, absolutely.",
            "🎱 No, undoubtedly.",
            "🎱 No, most assuredly.",
            "🎱 No, most definitely.",
            "🎱 No, most certainly.",
            "🎱 No, unquestionably.",
            "🎱 No, without question.",
            "🎱 No, without a doubt.",
            "🎱 No, indubitably.",
            "🎱 No, absolutely not.",
            "🎱 No, for certain.",
            "🎱 No, definitely not.",
            "🎱 No, beyond a doubt.",
            "🎱 No, clearly not.",
            "🎱 No, most assuredly not.",
            "🎱 No, without hesitation.",
            "🎱 No, certainly not.",
            "🎱 No, positively not.",
            "🎱 No, indubitably not.",
            "🎱 No, unquestionably not.",
            "🎱 No, indeed not.",
            "🎱 No, for sure not.",
            "🎱 No, most certainly not.",
            "🎱 No, undoubtedly not.",
            "🎱 No, most definitely not.",
            "🎱 No, absolutely not."
        ];

        const question = interaction.options.getString('question');
        const response = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎱 The Magic 8-Ball')
            .setDescription(`**Question:** ${question}\n**Answer:** ${response}`)
            .setTimestamp()
            .setFooter({ text: 'Magic 8-Ball' });

        await interaction.reply({ embeds: [embed] });
    }
};
