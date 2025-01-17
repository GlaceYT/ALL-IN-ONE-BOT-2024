const { EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../../models/users');

module.exports = {
    name: 'leaderboard',
    description: 'Displays the XP leaderboard.',
    async execute(message, args) {
        const itemsPerPage = 10; 
        const page = parseInt(args[0]) || 1; 

        try {
       
            let leaderboardData = await getLeaderboard(page, itemsPerPage);

          
            leaderboardData = leaderboardData.filter(user => user.userId !== message.client.user.id);

           
            if (!leaderboardData || leaderboardData.length === 0) {
                return message.reply(`No data available for page ${page}.`);
            }

            const leaderboardEntries = leaderboardData.map((user, index) => {
                const position = (page - 1) * itemsPerPage + index + 1;
                return `**${position}.** <@${user.userId}> - Level **${user.level}**, XP: **${user.xp}**`;
            });


            const leaderboardEmbed = new EmbedBuilder()
                .setColor('#FFD700') 
                .setTitle('🏆 XP Leaderboard')
                .setDescription(leaderboardEntries.join('\n'))
                .setFooter({
                    text: `Page ${page} | Requested by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setTimestamp();

            
            message.channel.send({ embeds: [leaderboardEmbed] });
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('An error occurred while fetching the leaderboard. Please try again later.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
