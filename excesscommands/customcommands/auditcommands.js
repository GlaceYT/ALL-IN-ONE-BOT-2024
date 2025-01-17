const { getUserCommands } = require('../../models/customCommands');
const { customCommandsCollection } = require('../../mongodb');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'auditcommands',
    description: 'Lists all custom commands created by users. Admin only.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Permission Denied')
                .setDescription('You do not have permission to use this command.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noPermissionEmbed] });
        }

        const allCommands = await customCommandsCollection.find({}).toArray();

        if (allCommands.length === 0) {
            const noCommandsEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('No Custom Commands')
                .setDescription('No custom commands have been set by any users.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noCommandsEmbed] });
        }

        const commandList = allCommands.map(cmd => `\`User :\` <@${cmd.userId}>, \`Command:\` ${cmd.commandName}, \`Response:\` ${cmd.response}`).join('\n');

        const commandsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Custom Commands Audit')
            .setDescription(commandList)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [commandsEmbed] });
    },
};
