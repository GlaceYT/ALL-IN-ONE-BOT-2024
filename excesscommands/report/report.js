const { addReport } = require('../../models/reports');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'report',
    description: 'Reports a user for a specified reason',
    async execute(message, args) {
        const userToReport = message.mentions.users.first();
        const reason = args.slice(1).join(' ');

        if (!userToReport) {
            return message.channel.send('Please mention a user to report.');
        }

        if (!reason) {
            return message.channel.send('Please provide a reason for the report.');
        }

        try {
            await addReport(userToReport.id, message.author.id, reason);
            const embed = new EmbedBuilder()
                .setTitle('Report Submitted')
                .setDescription(`User ${userToReport.tag} has been reported for: "${reason}".`)
                .setColor('#FF0000');

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error reporting the user.');
        }
    },
};
