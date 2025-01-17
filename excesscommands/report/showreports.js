const { EmbedBuilder } = require('discord.js');
const { getReports } = require('../../models/reports');

module.exports = {
    name: 'showreports',
    description: 'Shows all reports for a specified user',
    async execute(message, args) {
        const userToCheck = message.mentions.users.first();

        if (!userToCheck) {
            const noMentionEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('Please mention a user to view their reports.');
            return message.channel.send({ embeds: [noMentionEmbed] });
        }

        try {
            const reports = await getReports(userToCheck.id);

            if (reports && reports.reports.length > 0) {
             
                const reportDetails = await Promise.all(
                    reports.reports.map(async (r, index) => {
                        const reporter = await message.client.users.fetch(r.reporterId);
                        return `${index + 1}. Reported by **${reporter.tag}** on ${new Date(r.timestamp).toLocaleString()}: ${r.reason}`;
                    })
                );

                const reportEmbed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle(`Reports for ${userToCheck.tag}`)
                    .setDescription(reportDetails.join('\n'))
                    .setTimestamp();

                message.channel.send({ embeds: [reportEmbed] });
            } else {
                const noReportsEmbed = new EmbedBuilder()
                    .setColor('#FFFF00')
                    .setTitle('No Reports')
                    .setDescription(`${userToCheck.tag} has no reports.`);
                message.channel.send({ embeds: [noReportsEmbed] });
            }
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('There was an error retrieving the reports.');
            message.channel.send({ embeds: [errorEmbed] });
            console.error(error);
        }
    },
};
