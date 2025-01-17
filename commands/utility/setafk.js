const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const afkHandler = require('../../events/afkHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setafk')
        .setDescription('Set your AFK status')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for going AFK')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration of AFK (e.g., 10m, 1h)')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
        // Access the setAFK function using the client
        const { setAFK } = afkHandler(interaction.client);

        const reason = interaction.options.getString('reason');
        const durationStr = interaction.options.getString('duration');
        let duration = null;

        if (durationStr) {
            const match = durationStr.match(/^(\d+)([smhd])$/);
            if (!match)
                return interaction.reply({ content: 'Invalid duration format. Use s, m, h, or d (e.g., 10m, 1h).', ephemeral: true });

            const value = parseInt(match[1], 10);
            const multiplier = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[match[2]];
            duration = value * multiplier;
        }

        await setAFK(interaction.user.id, interaction.guild.id, reason, duration);

        const embed = new EmbedBuilder()
            .setTitle('AFK Set')
            .setDescription(`Reason: ${reason}\n${duration ? `Duration: ${durationStr}` : 'No expiration set.'}`)
            .setColor(0x00ff00);

        await interaction.reply({ embeds: [embed], ephemeral: true });
        await interaction.user.send(`You are now AFK: ${reason}${duration ? ` for ${durationStr}` : ''}`).catch(console.error);
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setafk`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
