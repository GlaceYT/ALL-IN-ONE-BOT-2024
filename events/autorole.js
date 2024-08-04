const fs = require('fs');
const path = require('path');


const configPath = path.join(__dirname, '../config.json');
let config = {};


function loadConfig() {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(data);
    } catch (err) {
        console.error('Error loading config:', err);
    }
}


loadConfig();


setInterval(loadConfig, 5000); 

module.exports = (client) => {
    client.on('guildMemberAdd', async member => {
        const guildId = member.guild.id;
        const settings = config.autorole[guildId];

        if (settings && settings.status === true) {
            const role = member.guild.roles.cache.get(settings.roleId);

            if (role) {
                try {
                    await member.roles.add(role);
                } catch (err) {
                    // console.error(`Failed to assign role to user ${member.user.tag}:`, err);
                }
            } else {
               //  console.error(`Role not found for guild ${member.guild.name}`);
            }
        } else {
           // console.error(`Autorole is disabled or not properly configured for guild ${member.guild.name}`);
        }
    });
};
