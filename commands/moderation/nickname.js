const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnickname')
        .setDescription('Set a new nickname for a member')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to set nickname')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('The new nickname')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames), // Adjust permission as needed
    async execute(interaction) {
        if (interaction.isCommand()) {
            // Slash command execution
            await executeSlashCommand(interaction);
        } else {
            // Prefix command execution
            await executePrefixCommand(interaction);
        }
    },
};

async function executeSlashCommand(interaction) {
    const sender = interaction.user;
    const targetUser = interaction.options.getUser('target');
    const nickname = interaction.options.getString('nickname');

    await handleSetNickname(interaction, sender, targetUser, nickname);
}

async function executePrefixCommand(message) {
    const sender = message.author;
    const args = message.content.trim().split(/ +/);
    args.shift(); // Remove the command name
    const targetUser = message.mentions.users.first();
    const nickname = args.join(' ');

    await handleSetNickname(message, sender, targetUser, nickname);
}

async function handleSetNickname(interaction, sender, targetUser, nickname) {
    // Ensure a nickname is provided
    if (!nickname) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('Please provide a nickname.');
        return interaction.reply({ embeds: [embed] });
    }

    // Fetch member from guild
    const member = interaction.guild.members.cache.get(targetUser.id);

    // Check if member exists
    if (!member) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('Member not found.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check if bot can manage the member
    if (!member.manageable) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription(`I cannot change the nickname of ${targetUser.tag}!`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Check permissions of the user invoking the command
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('You do not have permission to use this command.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
        // Attempt to set the nickname
        await member.setNickname(nickname);

        // Confirmation message
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setDescription(`Nickname of ${targetUser.tag} has been set to ${nickname}.`);
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        // Handle errors
        console.error('Failed to set nickname:', error);
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('Failed to set the nickname. Please try again later.');
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
