const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const cmdIcons = require('../../UI/icons/commandicons');

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
        if (interaction.isCommand && interaction.isCommand()) { 
        const status = interaction.options.getBoolean('status');
        const serverId = interaction.guild.id;

        console.log(`Server ID: ${serverId}`);
        console.log(`Hentai Commands Status: ${status}`);

        if (status === null) {
            return interaction.reply({ content: 'Invalid input. Please provide a valid status.', ephemeral: true });
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

            if (!config.owners) {
                config.owners = {};
            }

            const serverOwnerId = interaction.guild.ownerId;
            const memberId = interaction.user.id;
            const ownerId = config.owners[serverId];

            if (memberId !== serverOwnerId && memberId !== ownerId) {
                return interaction.reply({ content: 'Only the server owner or specified owners can use this command.', ephemeral: true });
            }

            if (!config.hentaicommands) {
                config.hentaicommands = {};
            }

            config.hentaicommands[serverId] = { status };

       
            fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Error writing config file:', err);
                    return interaction.reply({ content: 'There was an error writing to the config file.', ephemeral: true });
                }

                interaction.reply({ content: `Hentai commands status updated successfully for server ID ${serverId}.`, ephemeral: true });
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
        .setDescription('- This command can only be used through slash command!\n- Please use `/sethentaicommands` to setup.')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
