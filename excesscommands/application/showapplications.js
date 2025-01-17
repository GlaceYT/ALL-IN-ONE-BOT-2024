const { applicationCollection } = require('../../mongodb');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'showapplications',
    description: 'Show all the created applications with details.',
    async execute(message, args) {
        // Check for Administrator permissions
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Permission Denied')
                .setDescription('You do not have permission to use this command.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        try {
            const guildId = message.guild.id;

           
            const applications = await applicationCollection.find({ guildId }).toArray();

           
            if (!applications || applications.length === 0) {
                const noApplicationsEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('No Applications Found')
                    .setDescription('There are no applications created in this server.')
                    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                    .setTimestamp();

                return message.reply({ embeds: [noApplicationsEmbed] });
            }

          
            const applicationDetails = applications.map((app, index) => {
                const status = app.isActive ? '🟢 Active' : '🔴 Inactive';
                const questions = app.questions.length > 0
                    ? app.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
                    : 'No questions added.';
                const mainChannel = app.mainChannel ? `<#${app.mainChannel}>` : 'Not set.';
                const responseChannel = app.responseChannel ? `<#${app.responseChannel}>` : 'Not set.';

                return `**${index + 1}. ${app.appName}**\n` +
                    `**Status:** ${status}\n` +
                    `**Questions:**\n${questions}\n` +
                    `**Main Channel:** ${mainChannel}\n` +
                    `**Response Channel:** ${responseChannel}\n`;
            });

          
            const chunks = [];
            let currentChunk = '';

            for (const detail of applicationDetails) {
                if ((currentChunk + detail).length > 2048) {
                    chunks.push(currentChunk);
                    currentChunk = detail;
                } else {
                    currentChunk += detail + '\n';
                }
            }
            if (currentChunk) chunks.push(currentChunk);

          
            for (const [index, chunk] of chunks.entries()) {
                const embed = new EmbedBuilder()
                    .setColor(0x1E90FF)
                    .setTitle('📋 Applications List')
                    .setDescription(chunk)
                    .setFooter({
                        text: `Page ${index + 1} of ${chunks.length} | Requested by ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL(),
                    })
                    .setTimestamp();

                await message.channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('An error occurred while fetching the applications. Please try again later.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
