const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the config file
const configPath = path.join(__dirname, '../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setautorole')
        .setDescription('Set the auto-role for a server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('roleid')
                .setDescription('The ID of the role to be assigned')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('The status of the auto-role')
                .setRequired(true)),
    async execute(interaction) {
        const serverId = interaction.options.getString('serverid');
        const roleId = interaction.options.getString('roleid');
        const status = interaction.options.getBoolean('status');

        console.log(`Server ID: ${serverId}`);
        console.log(`Role ID: ${roleId}`);
        console.log(`Status: ${status}`);

        if (!serverId || !roleId || status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, role ID, and status.', ephemeral: true });
        }

        // Read the existing config file
        fs.readFile(configPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading config file:', err);
                return interaction.reply({ content: 'There was an error reading the config file.', ephemeral: true });
            }

            let config;
            try {
                config = JSON.parse(data);
            } catch (err) {
                console.error('Error parsing config file:', err);
                return interaction.reply({ content: 'There was an error parsing the config file.', ephemeral: true });
            }

            // Update the config object
            if (!config.autorole) {
                config.autorole = {};
            }

            if (!config.autorole[serverId]) {
                config.autorole[serverId] = {};
            }

            config.autorole[serverId].roleId = roleId;
            config.autorole[serverId].status = status;

            // Write the updated config back to the file
            fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Error writing config file:', err);
                    return interaction.reply({ content: 'There was an error writing to the config file.', ephemeral: true });
                }

                interaction.reply({ content: `Auto-role updated successfully for server ID ${serverId}.  ✅ Please Restart Bot!`, ephemeral: true });
            });
        });
    },
};
