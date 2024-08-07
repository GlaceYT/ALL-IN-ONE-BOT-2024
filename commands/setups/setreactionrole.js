const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');
const { reactionRolesCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setreactionrole')
        .setDescription('Set up a reaction role message')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the embed')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the reaction role message in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('role1')
                .setDescription('The first role ID')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('label1')
                .setDescription('The first button label')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('role2')
                .setDescription('The second role ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('label2')
                .setDescription('The second button label')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('role3')
                .setDescription('The third role ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('label3')
                .setDescription('The third button label')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('role4')
                .setDescription('The fourth role ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('label4')
                .setDescription('The fourth button label')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('role5')
                .setDescription('The fifth role ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('label5')
                .setDescription('The fifth button label')
                .setRequired(false)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setDescription('You do not have permission to use this command.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const channel = interaction.options.getChannel('channel');

        const roles = [];
        const labels = [];
        const customIds = [];

        for (let i = 1; i <= 5; i++) {
            const role = interaction.options.getString(`role${i}`);
            const label = interaction.options.getString(`label${i}`);
            if (role && label) {
                roles.push(role);
                labels.push(label);
                customIds.push(`reaction_role_${channel.id}_${i}`);
            }
        }

        if (roles.length === 0) {
            return interaction.reply({ content: 'You must provide at least one role and label.', ephemeral: true });
        }

        const embedDescription = roles.map((role, i) => `${labels[i]} - <@&${role}>`).join('\n');
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(`${description}\n\n${embedDescription}`)
            .setColor('#FF00FF');

        const buttons = roles.map((role, i) => new ButtonBuilder()
            .setCustomId(customIds[i])
            .setLabel(labels[i])
            .setStyle(ButtonStyle.Primary)
        );

        const row = new ActionRowBuilder().addComponents(buttons);

        const message = await channel.send({ embeds: [embed], components: [row] });

        for (let i = 0; i < roles.length; i++) {
            const roleId = roles[i];
            const customId = customIds[i];
            const label = labels[i];

            await reactionRolesCollection.insertOne({
                channelId: channel.id,
                messageId: message.id,
                roleId,
                customId,
                label,
                style: ButtonStyle.Primary
            });
        }

        await interaction.reply({ content: 'Reaction role message set up!', ephemeral: true });
    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setreactionrole`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    }
};
