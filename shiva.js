const axios = require('axios');
const dotenv = require('dotenv');
const colors = require('./UI/colors/colors');

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'https://server-backend-tdpa.onrender.com/api';
let serverOnline = true;


async function checkServerStatus() {

    try {
        const response = await axios.get(`${API_BASE_URL}/server-status`);
        serverOnline = response.data.serverOnline;
        
        if (serverOnline) {
            console.log('\n' + '─'.repeat(40));
            console.log(`${colors.magenta}${colors.bright}🔗  API SERVICES${colors.reset}`);
            console.log('─'.repeat(40));
            console.log(`${colors.cyan}[ SERVER ]${colors.reset} ${colors.green}Connected to backend server ✅${colors.reset}`);
            console.log(`${colors.cyan}[ STATUS ]${colors.reset} ${colors.green}Service Online 🌐${colors.reset}`);
        } else {
            console.log(`${colors.yellow}[ SERVER ]${colors.reset} ${colors.red}Server is offline ❌${colors.reset}`);
        }
        
    } catch (error) {
        console.log(`${colors.yellow}[ WARNING ]${colors.reset} ${colors.red}Failed to connect to server ⚠️${colors.reset}`);
        serverOnline = false;
    }
}

checkServerStatus();

module.exports = {
    isServerOnline: function() {
        return serverOnline;
    }
};
