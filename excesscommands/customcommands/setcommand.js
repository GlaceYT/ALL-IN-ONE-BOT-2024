const { createOrUpdateCommand } = require('../../models/customCommands');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'setcommand',
    description: 'Sets a custom command for the user with security checks.',
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
        const commandName = args.shift()?.toLowerCase();
        const response = args.join(' ');

        if (!commandName || !response) {
            const missingArgsEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Missing Arguments')
                .setDescription('Please provide a command name and a valid response.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [missingArgsEmbed] });
        }

        const restrictedCommandNames = ['nuke', 'raid', 'hack', 'shutdown', 'delete', 'ban', 'sex', 'hentai', 'love'];
        if (restrictedCommandNames.includes(commandName)) {
            const restrictedEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Restricted Command Name')
                .setDescription(`The command name \`${commandName}\` is restricted and cannot be used.`)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [restrictedEmbed] });
        }

        const forbiddenPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /drop\s+table\s+/gi,
            /select\s+\*\s+from\s+/gi,
            /[`$|{}<>;]/g,
        ];

        for (const pattern of forbiddenPatterns) {
            if (pattern.test(response)) {
                const forbiddenContentEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('Forbidden Content Detected')
                    .setDescription('Your response contains forbidden content and cannot be used.')
                    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                    .setTimestamp();

                return message.reply({ embeds: [forbiddenContentEmbed] });
            }
        }

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const isUrl = urlRegex.test(response);
        const isText = /^[a-zA-Z0-9\s.,!?'"-]+$/.test(response);

        if (!isUrl && !isText) {
            const invalidResponseEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Invalid Response')
                .setDescription('Only plain text and URLs are allowed in the response.')
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [invalidResponseEmbed] });
        }

        await createOrUpdateCommand(userId, commandName, response);

        const successEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: 'Custom Command added', iconURL: 'https://cdn.discordapp.com/emojis/770663775971966976.gif' })
            .setFooter({ text: 'Use !show-commands to view.', iconURL: 'https://cdn.discordapp.com/emojis/942629018296025128.gif' })
            .setDescription(`- Custom command has been securely set.\n- Command Name :  \`${commandName}\` `)
            .setTimestamp();

        message.reply({ embeds: [successEmbed] });
    },
};
