const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'https://server-backend-tdpa.onrender.com/api';
let serverOnline = true;

async function checkServerStatus() {
    try {
        const response = await axios.get(`${API_BASE_URL}/server-status`);
        serverOnline = response.data.serverOnline;
        if (serverOnline) {
            console.log('\x1b[36m[ SERVER ]\x1b[0m', '\x1b[32mConnected to backend server ✅\x1b[0m');
        } else {
            console.log('Server is offline.');
        }
    } catch (error) {
        console.log('\x1b[33m[ WARNING ]\x1b[0m', '\x1b[32mFailed to connect to server\x1b[0m');
        serverOnline = false;
    }
}

checkServerStatus();

module.exports = {
    isServerOnline: function() {
        return serverOnline;
    }
};
