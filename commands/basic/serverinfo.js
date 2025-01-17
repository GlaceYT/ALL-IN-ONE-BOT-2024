const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription(lang.serverInfoDescription),
    async execute(interaction) {
        const server = interaction.guild;
        const emojis = server.emojis.cache;
        const roles = server.roles.cache;
        const channels = server.channels.cache;
        const supportServerLink = lang.supportServerLink;
        const textChannels = channels.filter(channel => channel.type === 0).size; 
        const voiceChannels = channels.filter(channel => channel.type === 2).size; 
        const categories = channels.filter(channel => channel.type === 4).size; 
        const stageChannels = channels.filter(channel => channel.type === 13).size; 
        const totalChannels = textChannels + voiceChannels + stageChannels + categories;

        try {
            const owner = await server.members.fetch(server.ownerId);
            if (!owner) {
                throw new Error('Server owner not found.');
            }

            const boosters = server.premiumSubscriptionCount;
            const boostLevel = server.premiumTier;

            const embed = new EmbedBuilder()
                .setColor('#FFFFFF')
                .setAuthor({
                    name: lang.serverInfoTitle,
                    iconURL: cmdIcons.serverinfoIcon,
                    url: supportServerLink
                })
                .setThumbnail(server.iconURL({ format: 'png', dynamic: true, size: 1024 }))
                .addFields([
                    { name: lang.serverInfoFields.serverName, value: `\`\`\`${server.name}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.serverOwner, value: `\`\`\`${owner.user.tag}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.serverOwnerId, value: `\`\`\`${server.ownerId}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.serverId, value: `\`\`\`${server.id}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.members, value: `\`\`\`${server.memberCount}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.membersNonBots, value: `\`\`\`${server.members.cache.filter(member => !member.user.bot).size}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.bots, value: `\`\`\`${server.members.cache.filter(member => member.user.bot).size}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.serverBoosts, value: `\`\`\`${boosters} (Level: ${boostLevel})\`\`\``, inline: true },
                    { name: lang.serverInfoFields.categories, value: `\`\`\`${categories}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.totalChannels, value: `\`\`\`${totalChannels}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.textChannels, value: `\`\`\`${textChannels}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.voiceChannels, value: `\`\`\`${voiceChannels}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.stageChannels, value: `\`\`\`${stageChannels}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.emojis, value: `\`\`\`${emojis.size}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.normalEmojis, value: `\`\`\`${emojis.filter(emoji => !emoji.animated).size}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.animatedEmojis, value: `\`\`\`${emojis.filter(emoji => emoji.animated).size}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.stickers, value: `\`\`\`${server.stickers.cache.size}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.roles, value: `\`\`\`${roles.size}\`\`\``, inline: true },
                    { name: lang.serverInfoFields.serverCreatedOn, value: `\`\`\`${server.createdAt.toLocaleString()}\`\`\``, inline: true },
                ])
                .setTimestamp();

            if (emojis.size > 0) {
                embed.addFields({
                    name: lang.serverInfoFields.emojisList,
                    value: emojis.map(e => e.toString()).join(' '),
                    inline: false
                });
            }

            embed.addFields({
                name: lang.serverInfoFields.rolesList,
                value: roles.sort((a, b) => b.position - a.position).map(role => role.name).join(', '),
                inline: false
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching server information:', error);
            await interaction.reply(lang.serverInfoError);
        }
    },
};
