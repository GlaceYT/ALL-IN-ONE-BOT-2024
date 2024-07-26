const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the config file
const configPath = path.join(__dirname, '../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sethentaicommands')
        .setDescription('Enable or disable hentai commands')
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Enable or disable hentai commands')
                .setRequired(true)),
    async execute(interaction) {
        const status = interaction.options.getBoolean('status');
        const serverId = interaction.guild.id;

        console.log(`Server ID: ${serverId}`);
        console.log(`Hentai Commands Status: ${status}`);

        if (status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide a valid status.', ephemeral: true });
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

            // Update or add the hentaicommands section for the server
            if (!config.hentaicommands) {
                config.hentaicommands = {};
            }

            config.hentaicommands[serverId] = { status };

            // Write the updated config back to the file
            fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Error writing config file:', err);
                    return interaction.reply({ content: 'There was an error writing to the config file.', ephemeral: true });
                }

                interaction.reply({ content: `Hentai commands status updated successfully for server ID ${serverId}.`, ephemeral: true });
            });
        });
    },
};
