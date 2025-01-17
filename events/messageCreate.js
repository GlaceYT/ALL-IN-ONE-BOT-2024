const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const { serverConfigCollection } = require('../mongodb');
const configPath = path.join(__dirname, '..', 'config.json');
const lang = require('./loadLanguage');
const cmdIcons = require('../UI/icons/commandicons'); 
const { serverLevelingLogsCollection } = require('../mongodb');
const afkHandler = require('./afkHandler');
const { updateXp, getUserData } = require('../models/users');
const { getUserCommands } = require('../models/customCommands');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {


    
        try {
            const { handleAFKRemoval, handleMentions } = afkHandler(client);
            await handleAFKRemoval(message);
            await handleMentions(message);
        } catch (afkError) {
            console.error('AFK handler error:', afkError);
        }

        
        let xpGain = 10;

 
        if (message.attachments.size > 0) {
            xpGain += 5; 
        }

        if (/(https?:\/\/[^\s]+)/g.test(message.content)) {
            xpGain += 5; 
        }

 
        const { xp, level } = await updateXp(message.author.id, xpGain);
        const oldLevel = Math.floor(0.1 * Math.sqrt(xp - xpGain));

   
        const userData = await getUserData(message.author.id);

      
        if (level > oldLevel) {
            const logChannelId = await serverLevelingLogsCollection.findOne({ serverId: message.guild.id })
                .then(config => config?.levelLogsChannelId);

            const levelUpMessage = `${message.author}, you leveled up to **level ${level}!** 🎉`;

            
            const embed = new EmbedBuilder()
                .setColor('#1E90FF') 
                .setAuthor({
                    name: 'Level Up!',
                    iconURL: cmdIcons.rippleIcon,
                    url: 'https://discord.gg/xQF9f9yUEM', 
                })
                .setDescription(`🎉 **Congratulations, ${message.author}!**\nYou've reached **Level ${level}**!`)
                .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                .addFields(
                    { name: '📊 Current Level', value: `**${level}**`, inline: true },
                    { name: '💫 XP Gained This Week', value: `**${userData.weeklyXp || 0} XP**`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: '📈 Total XP', value: `**${userData.xp || 0} XP**`, inline: true },
                    { name: '✨ XP to Next Level', value: `**${Math.ceil(Math.pow((level + 1) / 0.1, 2) - xp)} XP**`, inline: true },
                )
                .setFooter({ text: 'Keep chatting to climb the leaderboard!', iconURL: cmdIcons.levelUpIcon })
                .setTimestamp();

            if (logChannelId) {
                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send({ content: levelUpMessage, embeds: [embed] });
                }
            } else {
                message.channel.send({ content: levelUpMessage, embeds: [embed] });
            }
        }
        
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

       
        const prefix = (serverConfig && serverConfig.prefix) || config.prefix;

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

       
        const customCommands = await getUserCommands(message.author.id);
        const customCommand = customCommands.find(cmd => cmd.commandName === commandName);

        if (customCommand) {
            try {
                message.reply(customCommand.response);
            } catch (error) {
                console.error('Error executing custom command:', error);
                message.reply('There was an error trying to execute your custom command!');
            }
            return; 
        }

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
