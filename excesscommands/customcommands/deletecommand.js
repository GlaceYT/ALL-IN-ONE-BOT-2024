const { deleteCommand } = require('../../models/customCommands');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'deletecommand',
    description: 'Deletes a custom command. Only the owner or an admin can delete a command.',
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
        const userId = message.author.id;
        const commandName = args.shift();

        if (!commandName) {
            const noCommandEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('No Command Name Provided')
                .setDescription('Please provide the command name you want to delete.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [noCommandEmbed] });
        }

        const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
        const wasDeleted = await deleteCommand(userId, commandName, isAdmin);

        if (wasDeleted) {
            const successEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setAuthor({ name: 'Custom Command deleted', iconURL: 'https://cdn.discordapp.com/emojis/770663775971966976.gif' })
                .setFooter({ text: 'Use !showcommands to view.', iconURL: 'https://cdn.discordapp.com/emojis/942629018296025128.gif' })
                .setDescription(`- Custom command has been successfully deleted.\n- Command Name :  \`${commandName}\` `)
                .setTimestamp();

            message.reply({ embeds: [successEmbed] });
        } else {
            const failureEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Deletion Failed')
                .setDescription(`You do not have permission to delete the command \`${commandName}\`, or it does not exist.`)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.reply({ embeds: [failureEmbed] });
        }
    },
};
