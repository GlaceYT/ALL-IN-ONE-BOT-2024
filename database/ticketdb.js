const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/tickets.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, channelId TEXT, guildId TEXT, userId TEXT)");
});

module.exports = db;
