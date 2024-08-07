const { ButtonBuilder, ButtonStyle, EmbedBuilder,ActionRowBuilder } = require('discord.js');
const { saveGiveaway, getGiveaways, deleteGiveaway } = require('../mongodb');

module.exports = (client) => {
  client.giveaways = [];

  async function loadGiveaways() {
    client.giveaways = await getGiveaways();
  }

  loadGiveaways();

  client.once('ready', () => {
    setInterval(checkGiveaways.bind(null, client), 5000); 
  });

  client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
      const giveaway = client.giveaways.find(g => g.messageId === interaction.message.id);
      if (!giveaway) return;

      if (interaction.customId === 'enter_giveaway') {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        
        if (giveaway.role && !member.roles.cache.has(giveaway.role)) {
          return interaction.reply({ content: 'You do not have the required role to enter this giveaway.', ephemeral: true })
            .catch(err => console.error('Failed to reply to interaction:', err));
        }
      
        if (!giveaway.entries.includes(interaction.user.id)) {
          giveaway.entries.push(interaction.user.id);
          await saveGiveaway(giveaway);
      
        
          await interaction.deferUpdate();
      
         
          await interaction.editReply({ 
            components: [createGiveawayButtons(giveaway)] 
          })
          .catch(err => console.error('Failed to update interaction:', err));
      
          
          await interaction.followUp({ 
            content: 'You have entered the giveaway!', 
            ephemeral: true 
          })
          .catch(err => console.error('Failed to follow up interaction:', err));
        } else {
          await interaction.reply({ 
            content: 'You are already entered in this giveaway.', 
            ephemeral: true 
          })
          .catch(err => console.error('Failed to reply to interaction:', err));
        }
      }
      else if (interaction.customId === 'view_participants') {
        const participants = giveaway.entries.map(entry => `<@${entry}>`).join('\n') || '❌ No participants yet.';
      
        const embed = new EmbedBuilder()
          .setTitle('Giveaway Participants')
          .setDescription(participants)
          .setColor(0x7289da)
          .setFooter({ text: `Giveaway ID: ${giveaway.messageId}` });
      
        await interaction.reply({ embeds: [embed], ephemeral: true })
          .catch(err => console.error('Failed to reply to interaction:', err));
      }
    }
  });

  async function checkGiveaways(client) {
    const now = Date.now();
    if (!client.giveaways) return;

    const newGiveaways = [];
    for (const giveaway of client.giveaways) {
      if (giveaway.endTime <= now) {
        const channel = await client.channels.fetch(giveaway.channel);
        if (!channel) continue;

        const winners = [];
        while (winners.length < giveaway.winners && giveaway.entries.length > 0) {
          const winnerId = giveaway.entries.splice(Math.floor(Math.random() * giveaway.entries.length), 1)[0];
          winners.push(`<@${winnerId}>`);
        }

        await channel.send({
          embeds: [{
            title: '🎉 Giveaway Ended! 🎉',
            description: `Prize: **${giveaway.prize}**\nWinners: ${winners.length > 0 ? winners.join(', ') : 'No valid entries.'}`,
            color: 0x7289da
          }]
        });

        await deleteGiveaway(giveaway.messageId); 
      } else {
        newGiveaways.push(giveaway);
      }
    }
    client.giveaways = newGiveaways;
  }

  function createGiveawayButtons(giveaway) {
    const enterButton = new ButtonBuilder()
      .setCustomId('enter_giveaway')
      .setLabel(`🎉 Enter Giveaway (${giveaway.entries.length})`)
      .setStyle(ButtonStyle.Danger);

    const viewButton = new ButtonBuilder()
      .setCustomId('view_participants')
      .setLabel('Participants')
      .setStyle(ButtonStyle.Secondary);

    return new ActionRowBuilder().addComponents(enterButton, viewButton);
  }
};
