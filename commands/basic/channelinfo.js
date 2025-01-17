const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channelinfo')
        .setDescription(lang.channelInfoDescription)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription(lang.channelOptionDescription)
                .setRequired(true)),
    async execute(interaction) {
        const createChannelInfoEmbed = (channel, guildIconURL) => {
            return new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: lang.channelInfo, 
                    iconURL: "https://cdn.discordapp.com/attachments/1246408947708072027/1256596058683736175/info.png?ex=668157c6&is=66800646&hm=dfa8e8b7b2500f1fc49aaf1de6ee8b9e17a6f824150742ee20e0a8475c63c935&",
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setThumbnail(guildIconURL)
                .setDescription(`
                    **${lang.channelName}:** ${channel.name}
                    **${lang.channelID}:** ${channel.id}
                    **${lang.channelType}:** ${channel.type}
                    **${lang.channelCreatedAt}:** ${channel.createdAt.toUTCString()}
                    **${lang.channelTopic}:** ${channel.topic || lang.channelNone}
                    **${lang.channelNSFW}:** ${channel.nsfw ? lang.channelYes : lang.channelNo}
                    **${lang.channelPosition}:** ${channel.position}
                    **${lang.channelCategory}:** ${channel.parent ? channel.parent.name : lang.channelNone}
                `)
                .setTimestamp();
        };

        const guildIconURL = interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const channel = interaction.options.getChannel('channel');
            const embed = createChannelInfoEmbed(channel, guildIconURL);
            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const channel = interaction.mentions.channels.first();

            if (!channel) {
                return interaction.reply(lang.channelMentionValid);
            }

            const embed = createChannelInfoEmbed(channel, guildIconURL);
            interaction.reply({ embeds: [embed] });
        }
    },
};
