const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const afkHandler = require('../../events/afkHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afks')
        .setDescription('Show a list of AFK users'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('You do not have permission to use this command.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        const { getAllAFKs } = afkHandler(interaction.client); 
        const afks = await getAllAFKs(interaction.guild.id);

        if (!afks.length) {
            return interaction.reply({ content: 'No users are currently AFK.', ephemeral: true });
        }

       
        const chunkSize = 25; 
        const afkChunks = [];
        for (let i = 0; i < afks.length; i += chunkSize) {
            afkChunks.push(afks.slice(i, i + chunkSize));
        }

        const embeds = [];
        for (const chunk of afkChunks) {
            const embed = new EmbedBuilder()
                .setTitle('AFK Users')
                .setColor(0xffcc00)
                .setTimestamp();

            for (const afk of chunk) {
             
                const user = await interaction.guild.members.fetch(afk.userId).catch(() => null);
                const userName = user ? user.displayName : `Unknown User (${afk.userId})`;

                embed.addFields({
                    name: userName,
                    value: `**Reason:** ${afk.reason}\n${afk.expiresAt ? `**Expires:** <t:${Math.floor(afk.expiresAt.getTime() / 1000)}:R>` : '**No expiration**'}`,
                });
            }

            embeds.push(embed);
        }

    
        await interaction.reply({ embeds });
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/afks`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
    
};
