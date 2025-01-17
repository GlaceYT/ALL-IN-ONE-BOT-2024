const { EmbedBuilder } = require('discord.js');
const { afkCollection } = require('../mongodb');
const ticketIcons = require('../UI/icons/ticketicons');

module.exports = (client) => {

  async function setAFK(userId, guildId, reason, duration) {
    const expiresAt = duration ? new Date(Date.now() + duration) : null;

    await afkCollection.updateOne(
      { userId, guildId },
      { $set: { reason, expiresAt, setAt: new Date() } },
      { upsert: true }
    );
  }


  async function removeAFK(userId, guildId) {
    await afkCollection.deleteOne({ userId, guildId });
  }


  async function getAFK(userId, guildId) {
    return afkCollection.findOne({ userId, guildId });
  }


  async function getAllAFKs(guildId) {
    return afkCollection.find({ guildId }).toArray();
  }

 
  async function removeExpiredAFKs() {
    const now = new Date();
    const expiredAFKs = await afkCollection.find({ expiresAt: { $lte: now } }).toArray();

    for (const afk of expiredAFKs) {
      const user = client.users.cache.get(afk.userId);
      if (user) {
        const embed = new EmbedBuilder()
          .setTitle('AFK Status Expired')
          .setDescription(`Your AFK status has expired.\n**Reason:** ${afk.reason}`)
          .setColor(0xffcc00)
          .setTimestamp();

        await user.send({ embeds: [embed] }).catch(console.error);
      }
    }

    await afkCollection.deleteMany({ expiresAt: { $lte: now } });
  }

  
  const processedMessages = new Set();
  async function handleMentions(message) {
    if (
      message.author.bot ||
      !message.mentions.users.size || 
      !message.guild ||
      processedMessages.has(message.id)
    )
      return;

    processedMessages.add(message.id);

    let afkReplySent = false;
    for (const [userId] of message.mentions.users) {
      const afk = await getAFK(userId, message.guild.id);

      if (afk && !afkReplySent) {
        const embed = new EmbedBuilder()
          .setAuthor({ 
            name: "AFK Notification", 
            iconURL: ticketIcons.correctIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
            })
          .setDescription(`<@${userId}> is currently AFK.\n**Reason:** ${afk.reason}`)
          .setColor(0x00bfff)
          .setTimestamp();

        if (afk.expiresAt) {
          embed.addFields({ name: 'Duration', value: `<t:${Math.floor(afk.expiresAt.getTime() / 1000)}:R>` });
        }

        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).catch(console.error);
        afkReplySent = true; 
      }
    }

   
    setTimeout(() => processedMessages.delete(message.id), 30000); // Adjust delay as needed
  }


  async function handleAFKRemoval(message) {
    if (!message.guild || !message.author) return; // Ignore DMs and invalid messages

    const authorAFK = await getAFK(message.author.id, message.guild.id);

    if (authorAFK) {
      await removeAFK(message.author.id, message.guild.id);

      const embed = new EmbedBuilder()
        .setAuthor({ 
        name: "AFK Notification", 
        iconURL: ticketIcons.correctIcon ,
        url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription(`Welcome back, <@${message.author.id}>! Your AFK status has been removed.`)
        .setColor(0x00ff7f)
        .setTimestamp();

      await message.channel.send({ embeds: [embed] }).catch(console.error);

      const dmEmbed = new EmbedBuilder()
        .setAuthor({ 
        name: "AFK Notification", 
        iconURL: ticketIcons.correctIcon ,
        url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('You are active again, so your AFK status has been removed.')
        .setColor(0x00ff7f)
        .setTimestamp();

      await message.author.send({ embeds: [dmEmbed] }).catch(console.error);
    }
  }

 
  client.once('ready', () => {
    setInterval(async () => {
      try {
        await removeExpiredAFKs();
        //console.log('\x1b[36m[ AFK Handler ]\x1b[0m', 'Expired AFK statuses cleaned up.');
      } catch (error) {
        console.error('Error cleaning up expired AFK statuses:', error);
      }
    }, 60000); // Runs every 60 seconds
  });

  // Event handler for messages
    //   client.on('messageCreate', async (message) => {
    //     try {
    //       await handleAFKRemoval(message);
    //       await handleMentions(message);
    //     } catch (error) {
    //       console.error('Error in AFK handler:', error);
    //     }
    //   });

  // Export functions
  return {
    setAFK,
    removeAFK,
    getAFK,
    getAllAFKs,
    handleAFKRemoval,
    handleMentions,
  };
};
