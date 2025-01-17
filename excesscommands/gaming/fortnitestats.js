const { EmbedBuilder } = require('discord.js');
const fortniteApiKey = process.env.FORTNITE_API_KEY; 
const { getEpic } = require('../../models/epicData'); 

module.exports = {
    name: 'fortnitestats',
    description: 'Gets your current BR rank or the mentioned user\'s BR rank. You can also provide an Epic Games name to get stats for that name.',
    async execute(message, args) {
        let user = message.mentions.users.first() || message.author;
        let epicName;

      
        if (message.mentions.users.size > 0) {
            epicName = await getEpic(user.id);
            if (!epicName) {
                return message.reply(`${user} has not set their Epic Games name. They can set it using the \`!set-epic [EpicName]\` command.`);
            }
        } else {
            epicName = args.length > 0 ? args.join(' ') : await getEpic(message.author.id);
            if (!epicName) {
                return message.reply(`${user} has not set their Epic Games name. They can set it using the \`!set-epic [EpicName]\` command.`);
            }
        }

        try {
          
            const response = await fetch(`https://fortnite-api.com/v2/stats/br/v2?name=${epicName}&accountType=epic`, {
                headers: {
                    'Authorization': fortniteApiKey
                }
            });

            const data = await response.json();

         
           

            if (data.status === 404) {
                if (data.error === 'the requested account does not exist') {
                    return message.reply('The Epic Games account does not exist.');
                } else if (data.error === 'the requested profile didnt play any match yet') {
                    return message.reply('The requested profile hasn\'t played any matches yet.');
                } else {
                    return message.reply('The requested profile does not exist.');
                }
            }

            if (data.status === 403) {
                if (data.error === "the requested account's stats are not public") {
                    return message.reply('The requested account\'s stats are not public.');
                } else {
                    return message.reply('Access to the requested account\'s stats is forbidden.');
                }
            }

            if (data.status !== 200 || !data.data) {
                return message.reply('Error fetching BR stats. Please ensure the Epic Games name is correct.');
            }

      
            const overallStats = data.data.stats.all.overall;

          
            const wins = overallStats?.wins ?? 'N/A';
            const kills = overallStats?.kills ?? 'N/A';
            const kdRatio = overallStats?.kd ?? 'N/A';
            const matches = overallStats?.matches ?? 'N/A';
            const winRate = overallStats?.winRate ? `${overallStats.winRate.toFixed(2)}%` : 'N/A';
            const score = overallStats?.score ?? 'N/A';
            const scorePerMin = overallStats?.scorePerMin ?? 'N/A';
            const scorePerMatch = overallStats?.scorePerMatch ?? 'N/A';
            const deaths = overallStats?.deaths ?? 'N/A';
            const top3 = overallStats?.top3 ?? 'N/A';
            const top5 = overallStats?.top5 ?? 'N/A';
            const top6 = overallStats?.top6 ?? 'N/A';
            const top10 = overallStats?.top10 ?? 'N/A';
            const top12 = overallStats?.top12 ?? 'N/A';
            const top25 = overallStats?.top25 ?? 'N/A';
            const minutesPlayed = overallStats?.minutesPlayed ?? 'N/A';
            const playersOutlived = overallStats?.playersOutlived ?? 'N/A';

        
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🎮 Fortnite BR Stats')
                .setDescription(`${user}'s BR stats for Epic Games name \`${epicName}\`:`)
                .addFields(
                    { name: 'Score', value: String(score), inline: true },
                    { name: 'Score Per Minute', value: String(scorePerMin), inline: true },
                    { name: 'Score Per Match', value: String(scorePerMatch), inline: true },
                    { name: 'Wins', value: String(wins), inline: true },
                    { name: 'Top 3s', value: String(top3), inline: true },
                    { name: 'Top 5s', value: String(top5), inline: true },
                    { name: 'Top 6s', value: String(top6), inline: true },
                    { name: 'Top 10s', value: String(top10), inline: true },
                    { name: 'Top 12s', value: String(top12), inline: true },
                    { name: 'Top 25s', value: String(top25), inline: true },
                    { name: 'Kills', value: String(kills), inline: true },
                    { name: 'Deaths', value: String(deaths), inline: true },
                    { name: 'K/D Ratio', value: String(kdRatio), inline: true },
                    { name: 'Matches Played', value: String(matches), inline: true },
                    { name: 'Win Rate', value: String(winRate), inline: true },
                    { name: 'Minutes Played', value: String(minutesPlayed), inline: true },
                    { name: 'Players Outlived', value: String(playersOutlived), inline: true }
                )
                .setTimestamp()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching BR stats:', error);
            return message.reply('An error occurred while fetching BR stats. Please try again later.');
        }
    }
};
