const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the antisetup file
const configPath = path.join(__dirname, '../../antisetup.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setantimodules')
        .setDescription('Set the anti-modules for a server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('antispam')
                .setDescription('Enable or disable anti-spam module')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('antilink')
                .setDescription('Enable or disable anti-link module')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('antinuke')
                .setDescription('Enable or disable anti-nuke module')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('antiraid')
                .setDescription('Enable or disable anti-raid module')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('logchannelid')
                .setDescription('The ID of the log channel')
                .setRequired(true)),
    async execute(interaction) {
        const serverId = interaction.options.getString('serverid');
        const antiSpam = interaction.options.getBoolean('antispam');
        const antiLink = interaction.options.getBoolean('antilink');
        const antiNuke = interaction.options.getBoolean('antinuke');
        const antiRaid = interaction.options.getBoolean('antiraid');
        const logChannelId = interaction.options.getString('logchannelid');

        console.log(`Server ID: ${serverId}`);
        console.log(`Anti-Spam: ${antiSpam}`);
        console.log(`Anti-Link: ${antiLink}`);
        console.log(`Anti-Nuke: ${antiNuke}`);
        console.log(`Anti-Raid: ${antiRaid}`);
        console.log(`Log Channel ID: ${logChannelId}`);

        if (!serverId || antiSpam === null || antiLink === null || antiNuke === null || antiRaid === null || !logChannelId) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, log channel ID, and status for all modules.', ephemeral: true });
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

            // Check if server exists
            if (!config[serverId]) {
                // Clone structure from another server (e.g., the first one in the config)
                const firstServerId = Object.keys(config)[0];
                if (!firstServerId) {
                    return interaction.reply({ content: 'No existing server data to clone from.', ephemeral: true });
                }

                config[serverId] = JSON.parse(JSON.stringify(config[firstServerId]));

                // Set the log channel and anti-modules based on the input
                config[serverId].logChannelId = logChannelId;
                config[serverId].antiSpam.enabled = antiSpam;
                config[serverId].antiLink.enabled = antiLink;
                config[serverId].antiNuke.enabled = antiNuke;
                config[serverId].antiRaid.enabled = antiRaid;
            } else {
                // Update the anti-modules for the existing server
                config[serverId].logChannelId = logChannelId;
                config[serverId].antiSpam.enabled = antiSpam;
                config[serverId].antiLink.enabled = antiLink;
                config[serverId].antiNuke.enabled = antiNuke;
                config[serverId].antiRaid.enabled = antiRaid;
            }

            // Write the updated config back to the file
            fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Error writing config file:', err);
                    return interaction.reply({ content: 'There was an error writing to the config file.', ephemeral: true });
                }

                interaction.reply({ content: `Anti-modules and log channel updated successfully for server ID ${serverId}.`, ephemeral: true });
            });
        });
    },
};
