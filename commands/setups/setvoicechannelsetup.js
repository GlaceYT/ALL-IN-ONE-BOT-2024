const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');


const configPath = path.join(__dirname, '../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setvoicechannelsetup')
        .setDescription('Set the voice channel setup for a server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mainvoicechannelid')
                .setDescription('The ID of the main voice channel')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('adminroleid')
                .setDescription('The ID of the admin role for voice channels')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('managerchannelid')
                .setDescription('The ID of the manager channel')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('The status of the voice channel setup')
                .setRequired(true)),
    async execute(interaction) {
        const serverId = interaction.options.getString('serverid');
        const mainVoiceChannelId = interaction.options.getString('mainvoicechannelid');
        const adminRoleId = interaction.options.getString('adminroleid');
        const managerChannelId = interaction.options.getString('managerchannelid');
        const status = interaction.options.getBoolean('status');

        console.log(`Server ID: ${serverId}`);
        console.log(`Main Voice Channel ID: ${mainVoiceChannelId}`);
        console.log(`Admin Role ID: ${adminRoleId}`);
        console.log(`Manager Channel ID: ${managerChannelId}`);
        console.log(`Status: ${status}`);

        if (!serverId || !mainVoiceChannelId || !adminRoleId || !managerChannelId || status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, main voice channel ID, admin role ID, manager channel ID, and status.', ephemeral: true });
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

         
            if (!config.voiceChannelSetup) {
                config.voiceChannelSetup = {};
            }

            if (!config.voiceChannelSetup[serverId]) {
                config.voiceChannelSetup[serverId] = {};
            }

            config.voiceChannelSetup[serverId].mainVoiceChannelId = mainVoiceChannelId;
            config.voiceChannelSetup[serverId].adminRoleId = adminRoleId;
            config.voiceChannelSetup[serverId].managerChannelId = managerChannelId;
            config.voiceChannelSetup[serverId].status = status;

           
            fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Error writing config file:', err);
                    return interaction.reply({ content: 'There was an error writing to the config file.', ephemeral: true });
                }

                interaction.reply({ content: `Voice channel setup updated successfully for server ID ${serverId}.  ✅ Please Restart Bot!`, ephemeral: true });
            });
        });
    },
};
