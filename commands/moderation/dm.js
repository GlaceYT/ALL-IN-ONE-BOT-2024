const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Sends a direct message to a member in the server')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to DM')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    async execute(interaction) {
        let sender = interaction.user; 
        let targetUser;
        let messageContent;

        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            targetUser = interaction.options.getUser('target');
            messageContent = interaction.options.getString('message');
        } else {
            // Prefix command execution
            const message = interaction;
            sender = message.author;
            targetUser = message.mentions.users.first();
            const args = message.content.split(' ');
            args.shift(); // Remove the command name
            messageContent = args.join(' ');
        }

        // Check if targetUser can receive DMs
        if (!targetUser.bot && targetUser.dmChannel) {
            // Construct DM embed
            const dmEmbed = new EmbedBuilder()
                .setTitle('You have received a direct message!')
                .setDescription(`You have received a direct message from ${sender} in ${interaction.guild.name}:\n${messageContent}`)
                .setColor(0x00ccff); // Blue color

            try {
                // Send DM to the target user
                await targetUser.send({ embeds: [dmEmbed] });

                // Construct confirmation embed
                const confirmationEmbed = new EmbedBuilder()
                    .setDescription(`Direct message sent to ${targetUser}`)
                    .setColor(0x00ccff); // Blue color

                // Send confirmation message to the channel
                await interaction.reply({ embeds: [confirmationEmbed] });
            } catch (error) {
                // Handle error if user has closed DMs or blocked the bot
                console.error(`Failed to send DM to ${targetUser.tag}:`, error);

                // Inform about DM failure
                const failureEmbed = new EmbedBuilder()
                    .setDescription(`Failed to send direct message to ${targetUser}. They may have DMs closed or blocked the bot.`)
                    .setColor(0x00ccff); // Red color

                await interaction.reply({ embeds: [failureEmbed] });
            }
        } else {
            // Inform about inability to DM
            const noDMEmbed = new EmbedBuilder()
                .setDescription(`${targetUser} cannot receive direct messages.`)
                .setColor(0x00ccff); // Red color

            await interaction.reply({ embeds: [noDMEmbed] });
        }
    },
};
