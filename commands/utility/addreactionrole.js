const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('../../database/reactionrolesdb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addreactionrole')
    .setDescription('Set up a reaction role message')
    .setDefaultPermission(false)
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
      option.setName('emoji1')
        .setDescription('The first emoji')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('role2')
        .setDescription('The second role ID')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('emoji2')
        .setDescription('The second emoji')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('role3')
        .setDescription('The third role ID')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('emoji3')
        .setDescription('The third emoji')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('role4')
        .setDescription('The fourth role ID')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('emoji4')
        .setDescription('The fourth emoji')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('role5')
        .setDescription('The fifth role ID')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('emoji5')
        .setDescription('The fifth emoji')
        .setRequired(false))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),    
  async execute(interaction) {
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
    const emojis = [];

    for (let i = 1; i <= 5; i++) {
      const role = interaction.options.getString(`role${i}`);
      const emoji = interaction.options.getString(`emoji${i}`);
      if (role && emoji) {
        roles.push(role);
        emojis.push(emoji);
      }
    }

    if (roles.length === 0) {
      return interaction.reply({ content: 'You must provide at least one role and emoji.', ephemeral: true });
    }

    const embedDescription = roles.map((role, i) => `${emojis[i]} - <@&${role}>`).join('\n');
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`${description}\n\n${embedDescription}`)
      .setColor('#FF00FF');

    const message = await channel.send({ embeds: [embed] });

    for (let i = 0; i < roles.length; i++) {
      const roleId = roles[i];
      const emoji = emojis[i];

      db.addReactionRole(channel.id, message.id, roleId, emoji);
      await message.react(emoji);
    }

    await interaction.reply({ content: 'Reaction role message set up!', ephemeral: true });
  }
};
