const fs = require('fs');
const path = require('path');

module.exports = function loadLogHandlers(client) {
    const logHandlersPath = path.join(__dirname);

    fs.readdirSync(logHandlersPath).forEach((file) => {
        if (file === 'index.js') return; // Skip this file

        const handler = require(path.join(logHandlersPath, file));

        if (typeof handler === 'function') {
            handler(client); // Initialize the handler
        }
    });
};
