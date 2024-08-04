const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const cmdIcons = require('../../UI/icons/commandicons');

const configPath = path.join(__dirname, '../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setserverconfig')
        .setDescription('Set the owner ID and prefix for a specific server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ownerid')
                .setDescription('The owner ID for the server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('The prefix for the server')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
        const serverId = interaction.options.getString('serverid');
        const ownerId = interaction.options.getString('ownerid');
        const prefix = interaction.options.getString('prefix');
        const guild = interaction.guild;

        
        const serverOwnerId = guild.ownerId;
        if (interaction.user.id !== serverOwnerId) {
            return interaction.reply({ content: 'Only the server owner can use this command.', ephemeral: true });
        }

  
        if (serverId !== guild.id) {
            return interaction.reply({ content: 'The server ID provided does not match the server ID of this server.', ephemeral: true });
        }

        if (!serverId || !ownerId || !prefix) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, owner ID, and prefix.', ephemeral: true });
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

      
            if (!config.prefixes) {
                config.prefixes = {
                    default: '!',
                    server_specific: {}
                };
            }

     
            if (!config.prefixes.server_specific) {
                config.prefixes.server_specific = {};
            }

        
            if (!config.owners) {
                config.owners = {};
            }

           
            config.prefixes.server_specific[serverId] = prefix;
            config.owners[serverId] = ownerId;

       
            fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Error writing config file:', err);
                    return interaction.reply({ content: 'There was an error writing to the config file.', ephemeral: true });
                }

                interaction.reply({ content: `Server-specific prefix and owner ID updated successfully for server ID ${serverId}.`, ephemeral: true });
            });
        });
    }else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setserverconfig` to setup.')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
