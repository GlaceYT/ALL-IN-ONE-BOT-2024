const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setticketchannel')
        .setDescription('Set the ticket channel for a server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('channelid')
                .setDescription('The ID of the ticket channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('adminroleid')
                .setDescription('The ID of the admin role for tickets')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('The status of the ticket channel')
                .setRequired(true)),
    async execute(interaction) {
        const serverId = interaction.options.getString('serverid');
        const channelId = interaction.options.getString('channelid');
        const adminRoleId = interaction.options.getString('adminroleid');
        const status = interaction.options.getBoolean('status');

        console.log(`Server ID: ${serverId}`);
        console.log(`Channel ID: ${channelId}`);
        console.log(`Admin Role ID: ${adminRoleId}`);
        console.log(`Status: ${status}`);

        if (!serverId || !channelId || !adminRoleId || status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, channel ID, admin role ID, and status.', ephemeral: true });
        }

      
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

            if (!config.tickets) {
                config.tickets = {};
            }

            if (!config.tickets[serverId]) {
                config.tickets[serverId] = {};
            }

            config.tickets[serverId].ticketChannelId = channelId;
            config.tickets[serverId].adminRoleId = adminRoleId;
            config.tickets[serverId].status = status;

         
            fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Error writing config file:', err);
                    return interaction.reply({ content: 'There was an error writing to the config file.', ephemeral: true });
                }

                interaction.reply({ content: `Ticket channel updated successfully for server ID ${serverId}.  ✅ Please Restart Bot!`, ephemeral: true });
            });
        });
    },
};
