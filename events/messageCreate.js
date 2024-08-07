const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const { serverConfigCollection } = require('../mongodb');
const configPath = path.join(__dirname, '..', 'config.json');
const lang = require('./loadLanguage');
const client = require('../main');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        let config;
        try {
            const data = fs.readFileSync(configPath, 'utf8');
            config = JSON.parse(data);
        } catch (err) {
            //console.error('Error reading or parsing config file:', err);
            return message.reply(lang.error);
        }

        let serverConfig;
        try {
            serverConfig = await serverConfigCollection.findOne({ serverId: message.guild.id });
        } catch (err) {
            //console.error('Error fetching server configuration from MongoDB:', err);
        }

        // Use the server-specific prefix if it exists, otherwise fall back to the default prefix
        const prefix = (serverConfig && serverConfig.prefix) || config.prefix;

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command) return;

        const category = command.category || 'undefined';

      
        if (command.source === 'shiva') {
            try {
                await command.execute(message, args, client);
            } catch (error) {
                //console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Command Error')
                    .setDescription(lang.commandError.replace('{commandName}', commandName))
                    .addFields({ name: 'Error Details:', value: error.message });

                message.reply({ embeds: [errorEmbed] });
            }
            return;
        }

       
        if (!config.categories[category]) {
            try {
                //await message.reply({ content: `The command in category \`${category}\` is disabled.` });
            } catch (replyError) {
                //console.error('Error when sending command disabled reply:', replyError);
            }
            return;
        }
        

    
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Command Error')
                .setDescription(lang.commandError.replace('{commandName}', commandName))
                .addFields({ name: 'Error Details:', value: error.message });

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
