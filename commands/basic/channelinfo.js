const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channelinfo')
        .setDescription('Show detailed information about a channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to get information about')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            const channel = interaction.options.getChannel('channel');

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Channel Information", 
                    iconURL: "https://cdn.discordapp.com/attachments/1246408947708072027/1256596058683736175/info.png?ex=668157c6&is=66800646&hm=dfa8e8b7b2500f1fc49aaf1de6ee8b9e17a6f824150742ee20e0a8475c63c935&" ,
                     url: "https://discord.gg/xQF9f9yUEM"
                    })
                .setThumbnail(interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))
                .setDescription(`
                    **Channel Name:** ${channel.name}
                    **Channel ID:** ${channel.id}
                    **Type:** ${channel.type}
                    **Created At:** ${channel.createdAt.toUTCString()}
                    **Topic:** ${channel.topic || 'None'}
                    **NSFW:** ${channel.nsfw ? 'Yes' : 'No'}
                    **Position:** ${channel.position}
                    **Category:** ${channel.parent ? channel.parent.name : 'None'}
                `)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // Prefix command execution
            const channel = interaction.mentions.channels.first();

            if (!channel) {
                return interaction.reply('Please mention a valid channel.');
            }

            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Channel Information", 
                    iconURL: "https://cdn.discordapp.com/attachments/1246408947708072027/1256596058683736175/info.png?ex=668157c6&is=66800646&hm=dfa8e8b7b2500f1fc49aaf1de6ee8b9e17a6f824150742ee20e0a8475c63c935&" ,
                     url: "https://discord.gg/xQF9f9yUEM"
                    })
                .setThumbnail(interaction.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))
                .setDescription(`
                    **Channel Name:** ${channel.name}
                    **Channel ID:** ${channel.id}
                    **Type:** ${channel.type}
                    **Created At:** ${channel.createdAt.toUTCString()}
                    **Topic:** ${channel.topic || 'None'}
                    **NSFW:** ${channel.nsfw ? 'Yes' : 'No'}
                    **Position:** ${channel.position}
                    **Category:** ${channel.parent ? channel.parent.name : 'None'}
                `)
                .setTimestamp();

            interaction.reply({ embeds: [embed] });
        }
    },
};
