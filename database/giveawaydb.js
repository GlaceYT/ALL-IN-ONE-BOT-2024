const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/giveawaydb.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS giveaways (
    messageId TEXT PRIMARY KEY,
    channel TEXT,
    prize TEXT,
    winners INTEGER,
    endTime INTEGER,
    role TEXT,
    entries TEXT
  )`);
});

const saveGiveaway = (giveaway) => {
  db.run(`REPLACE INTO giveaways (messageId, channel, prize, winners, endTime, role, entries) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    [giveaway.messageId, giveaway.channel, giveaway.prize, giveaway.winners, giveaway.endTime, giveaway.role, JSON.stringify(giveaway.entries)], 
    (err) => {
      if (err) {
        return console.error(err.message);
      }
    }
  );
};

const getGiveaways = (callback) => {
  db.all(`SELECT * FROM giveaways`, (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    callback(rows.map(row => ({
      messageId: row.messageId,
      channel: row.channel,
      prize: row.prize,
      winners: row.winners,
      endTime: row.endTime,
      role: row.role,
      entries: JSON.parse(row.entries)
    })));
  });
};

const deleteGiveaway = (messageId) => {
  db.run(`DELETE FROM giveaways WHERE messageId = ?`, [messageId], (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
};

module.exports = { saveGiveaway, getGiveaways, deleteGiveaway };
