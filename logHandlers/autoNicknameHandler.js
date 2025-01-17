const { nicknameConfigs } = require('../mongodb'); 
const { EmbedBuilder } = require('discord.js');

module.exports = async function autoNicknameHandler(client) {
    client.on('guildMemberAdd', async (member) => {
        const guildId = member.guild.id;

   
        const config = await nicknameConfigs.findOne({ guildId });


        if (!config || !config.status) return;

        const prefix = config.nicknamePrefix;

      
        const newNickname = `${prefix} ${member.user.username}`;

        
        try {
            await member.setNickname(newNickname);
            //console.log(`Nickname for ${member.user.tag} changed to: ${newNickname}`);
        } catch (error) {
            //console.error(`Failed to set nickname for ${member.user.tag}: ${error.message}`);
        }

     
        // const logChannel = member.guild.channels.cache.find(
        //     channel => channel.name === 'logs' && channel.isTextBased()
        // );
        // if (logChannel) {
        //     const embed = new EmbedBuilder()
        //         .setTitle('🔄 Nickname Changed Automatically')
        //         .setColor('#00FF00')
        //         .addFields(
        //             { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
        //             { name: 'New Nickname', value: newNickname, inline: true },
        //         )
        //         .setTimestamp();

        //     logChannel.send({ embeds: [embed] });
        // }
    });
};
