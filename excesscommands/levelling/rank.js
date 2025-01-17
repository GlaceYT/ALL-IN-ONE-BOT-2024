const { getUserData } = require('../../models/users');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rank',
    description: 'Show your rank card or the rank card of another user.',
    async execute(message, args) {
        try {
           
            const target = message.mentions.users.first() || message.author;

           
            const userData = await getUserData(target.id);
            if (!userData) {
                return message.reply(`${target.username} has no rank data available.`);
            }

            
            const requiredXp = Math.ceil((userData.level + 1) ** 2 * 100);

          
            const rankEmbed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setAuthor({
                    name: `${target.username}'s Rank`,
                    iconURL: target.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(`🏆 **Rank and XP Details**`)
                .addFields(
                    { name: '📊 Level', value: `**${userData.level}**`, inline: true },
                    { name: '💫 Current XP', value: `**${userData.xp} / ${requiredXp}**`, inline: true },
                    { name: '✨ XP to Next Level', value: `**${requiredXp - userData.xp} XP**`, inline: false }
                )
                .setFooter({
                    text: 'Keep chatting to climb the ranks!',
                    iconURL: message.guild.iconURL({ dynamic: true }),
                })
                .setTimestamp();

         
            message.reply({ embeds: [rankEmbed] });
        } catch (error) {
            console.error("Error generating rank embed:", error);
            message.reply('There was an error fetching the rank details. Please try again later.');
        }
    }
};
