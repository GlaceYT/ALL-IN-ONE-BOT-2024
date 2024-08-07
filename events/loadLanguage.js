const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.json');
let config;

try {
  const data = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(data);
} catch (err) {
  console.error('Error reading or parsing config file:', err);
  process.exit(1);
}

const langPath = path.join(__dirname, '../languages', `${config.language}.js`);
let lang;

try {
  lang = require(langPath);
} catch (err) {
  console.error(`Language file for ${config.language} not found.`, err);
  process.exit(1);
}

module.exports = lang;
