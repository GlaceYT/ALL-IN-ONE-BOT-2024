const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/reactionroles.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS reactionroles (channelId TEXT, messageId TEXT, roleId TEXT, emoji TEXT, PRIMARY KEY (channelId, messageId, roleId, emoji))");
});

module.exports = {
  addReactionRole(channelId, messageId, roleId, emoji) {
    db.run("INSERT OR REPLACE INTO reactionroles (channelId, messageId, roleId, emoji) VALUES (?, ?, ?, ?)", [channelId, messageId, roleId, emoji]);
  },
  getReactionRoles(callback) {
    db.all("SELECT * FROM reactionroles", (err, rows) => {
      callback(rows);
    });
  }
};
