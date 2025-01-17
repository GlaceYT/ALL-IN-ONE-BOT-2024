const { logsCollection } = require('../mongodb');
const { EmbedBuilder } = require('discord.js');

module.exports = async function nicknameChangeHandler(client) {
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        const guildId = newMember.guild.id;

        // Fetch config
        const config = await logsCollection.findOne({ guildId, eventType: 'nicknameChange' });
        if (!config || !config.channelId) return;

        const logChannel = newMember.guild.channels.cache.get(config.channelId);

        if (logChannel && oldMember.nickname !== newMember.nickname) {
            const embed = new EmbedBuilder()
                .setTitle('📝 Nickname Changed')
                .setColor('#00FFFF')
                .addFields(
                    { name: 'User', value: `${newMember.user.tag} (${newMember.id})`, inline: true },
                    { name: 'Old Nickname', value: oldMember.nickname || '*None*', inline: true },
                    { name: 'New Nickname', value: newMember.nickname || '*None*', inline: true },
                )
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
