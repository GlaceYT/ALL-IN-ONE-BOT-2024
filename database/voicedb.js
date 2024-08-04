const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/voicedb.db');


db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS voice_channels (id TEXT PRIMARY KEY, guildId TEXT, channelId TEXT, userId TEXT, createdAt TEXT, isTemporary INTEGER)");
  db.run("CREATE TABLE IF NOT EXISTS voice_channel_messages (messageId TEXT PRIMARY KEY, channelId TEXT, userId TEXT)");
});

module.exports = db;
