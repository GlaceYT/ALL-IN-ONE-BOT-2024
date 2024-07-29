const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const cmdIcons = require('../../UI/icons/commandicons');

const configPath = path.join(__dirname, '../../config.json');
const nqnConfigPath = path.join(__dirname, '../../nqnConfig.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnqnstatus')
        .setDescription('Set the NQN status for a server')
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('The ID of the server')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Enable or disable NQN')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
        const serverId = interaction.options.getString('serverid');
        const status = interaction.options.getBoolean('status');
        const guild = interaction.guild;

        if (!serverId || status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide a valid server ID and status.', ephemeral: true });
        }

 
        fs.readFile(configPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading config file:', err);
                return interaction.reply({ content: 'There was an error reading the config file.', ephemeral: true });
            }

            let ownerConfig;
            try {
                ownerConfig = JSON.parse(data);
            } catch (err) {
                console.error('Error parsing config file:', err);
                return interaction.reply({ content: 'There was an error parsing the config file.', ephemeral: true });
            }

       
            if (!ownerConfig.owners) {
                ownerConfig.owners = {};
            }

  
            const serverOwnerId = guild.ownerId;
            const memberId = interaction.user.id;
            const ownerId = ownerConfig.owners[serverId];
            if (serverId !== guild.id) {
                return interaction.reply({ content: 'The server ID provided does not match the server ID of this server.', ephemeral: true });
            }
            if (memberId !== serverOwnerId && memberId !== ownerId) {
                return interaction.reply({ content: 'Only the server owner or specified owners can use this command.', ephemeral: true });
            }

     
            fs.readFile(nqnConfigPath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading NQN config file:', err);
                    return interaction.reply({ content: 'There was an error reading the NQN config file.', ephemeral: true });
                }

                let nqnConfig;
                try {
                    nqnConfig = JSON.parse(data);
                } catch (err) {
                    console.error('Error parsing NQN config file:', err);
                    return interaction.reply({ content: 'There was an error parsing the NQN config file.', ephemeral: true });
                }

        
                if (!nqnConfig.nqn) {
                    nqnConfig.nqn = {};
                }

          
                nqnConfig.nqn[serverId] = { status };

           
                fs.writeFile(nqnConfigPath, JSON.stringify(nqnConfig, null, 4), (err) => {
                    if (err) {
                        console.error('Error writing NQN config file:', err);
                        return interaction.reply({ content: 'There was an error writing to the NQN config file.', ephemeral: true });
                    }

                    interaction.reply({ content: `NQN status updated successfully for server ID ${serverId}.`, ephemeral: true });
                });
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
        .setDescription('- This command can only be used through slash command!\n- Please use `/setnqnstatus` to setup.')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
