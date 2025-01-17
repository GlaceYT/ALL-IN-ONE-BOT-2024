const { commandLogsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');

module.exports = async function commandExecutionHandler(client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName, user, guild, channel } = interaction;
        const logData = {
            commandName,
            userId: user.id,
            userName: user.tag,
            guildId: guild?.id || null,
            channelId: channel.id,
            timestamp: new Date(),
        };

   
        await commandLogsCollection.insertOne(logData);

        if (guild) {
            const config = await commandLogsCollection.findOne({ guildId: guild.id });

            if (config && config.channelId) {
                const logChannel = client.channels.cache.get(config.channelId);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setTitle('📜 Command Executed')
                        .setColor('#3498db')
                        .addFields(
                            { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                            { name: 'Command', value: `/${commandName}`, inline: true },
                            { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                        )
                        .setTimestamp();

                    logChannel.send({ embeds: [embed] });
                }
            }
        }
    });
};
