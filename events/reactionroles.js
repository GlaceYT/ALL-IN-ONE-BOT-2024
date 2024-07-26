const db = require('../database/reactionrolesdb');

module.exports = (client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    const { message, emoji } = reaction;
    const member = message.guild.members.cache.get(user.id);

    db.getReactionRoles((reactionRoles) => {
      const reactionRole = reactionRoles.find(rr => rr.messageId === message.id && rr.emoji === emoji.name);

      if (reactionRole) {
        const role = message.guild.roles.cache.get(reactionRole.roleId);
        if (role) {
          member.roles.add(role).catch(console.error);
        }
      }
    });
  });

  client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return;

    const { message, emoji } = reaction;
    const member = message.guild.members.cache.get(user.id);

    db.getReactionRoles((reactionRoles) => {
      const reactionRole = reactionRoles.find(rr => rr.messageId === message.id && rr.emoji === emoji.name);

      if (reactionRole) {
        const role = message.guild.roles.cache.get(reactionRole.roleId);
        if (role) {
          member.roles.remove(role).catch(console.error);
        }
      }
    });
  });

  // Load reaction roles when bot starts
  client.once('ready', () => {
    db.getReactionRoles((reactionRoles) => {
      reactionRoles.forEach(rr => {
        const channel = client.channels.cache.get(rr.channelId);
        if (channel) {
          channel.messages.fetch(rr.messageId).then(message => {
            // Re-add reactions to the message
            message.reactions.removeAll().then(() => {
              rr.emoji.split(',').forEach(async emoji => {
                await message.react(emoji).catch(console.error);
              });
            });
          }).catch(console.error);
        }
      });
    });
  });
};
