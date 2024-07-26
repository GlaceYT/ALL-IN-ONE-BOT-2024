const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const ms = require('ms');
const { saveGiveaway } = require('../../database/giveawaydb');

const giveawayCommand = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('Manage giveaways')
  .addSubcommand(subcommand =>
    subcommand
      .setName('start')
      .setDescription('Start a giveaway')
      .addStringOption(option => option.setName('title').setDescription('Giveaway title').setRequired(true))
      .addStringOption(option => option.setName('description').setDescription('Giveaway description').setRequired(true))
      .addStringOption(option => option.setName('prize').setDescription('Prize description').setRequired(true))
      .addStringOption(option => option.setName('duration').setDescription('Giveaway duration (e.g.,1m, 24h, 3d, 1 week)').setRequired(true))
      .addIntegerOption(option => option.setName('winners').setDescription('Number of winners').setRequired(false))
      .addChannelOption(option => option.setName('channel').setDescription('Channel for the giveaway').setRequired(false))
      .addRoleOption(option => option.setName('roles').setDescription('Role requirement to enter').setRequired(false))
  );

module.exports = {
  data: giveawayCommand,
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const prize = interaction.options.getString('prize');
    const duration = interaction.options.getString('duration');
    const winners = interaction.options.getInteger('winners') || 1;
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const role = interaction.options.getRole('roles');

    const giveawayEndTime = Date.now() + ms(duration);

    const giveawayEmbed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(`${description}\n\nPrize: **${prize}**\nEnds: <t:${Math.floor(giveawayEndTime / 1000)}:R>\nWinners: ${winners}`)
      .setColor(0x7289da);

    const message = await channel.send({ embeds: [giveawayEmbed], components: [createGiveawayButtons({ entries: [] })] });

    const giveaway = {
      messageId: message.id,
      prize,
      endTime: giveawayEndTime,
      winners,
      channel: channel.id,
      role: role ? role.id : null,
      entries: [],
    };

    if (!interaction.client.giveaways) {
      interaction.client.giveaways = [];
    }

    interaction.client.giveaways.push(giveaway);
    saveGiveaway(giveaway); // Save state after creating a giveaway

    await interaction.reply({ content: 'Giveaway started!', ephemeral: true });
  }
};

function createGiveawayButtons(giveaway) {
  const enterButton = new ButtonBuilder()
    .setCustomId('enter_giveaway')
    .setLabel(`🎉 Enter Giveaway (${giveaway.entries.length})`)
    .setStyle(ButtonStyle.Danger);

  const viewButton = new ButtonBuilder()
    .setCustomId('view_participants')
    .setLabel('View Participants')
    .setStyle(ButtonStyle.Secondary);

  return new ActionRowBuilder().addComponents(enterButton, viewButton);
}
