const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const cmdIcons = require('../../UI/icons/commandicons');

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
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ownerid1')
                .setDescription('The first owner ID')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('adminid1')
                .setDescription('The first admin ID')
                .setRequired(true))           
        .addStringOption(option =>
            option.setName('ownerid2')
                .setDescription('The second owner ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('ownerid3')
                .setDescription('The third owner ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('ownerid4')
                .setDescription('The fourth owner ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('adminid2')
                .setDescription('The second admin ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('adminid3')
                .setDescription('The third admin ID')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('adminid4')
                .setDescription('The fourth admin ID')
                .setRequired(false)),
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
        const serverId = interaction.options.getString('serverid');
        const antiSpam = interaction.options.getBoolean('antispam');
        const antiLink = interaction.options.getBoolean('antilink');
        const antiNuke = interaction.options.getBoolean('antinuke');
        const antiRaid = interaction.options.getBoolean('antiraid');
        const logChannelId = interaction.options.getString('logchannelid');
        const ownerIds = [
            interaction.options.getString('ownerid1'),
            interaction.options.getString('ownerid2'),
            interaction.options.getString('ownerid3'),
            interaction.options.getString('ownerid4')
        ].filter(Boolean);
        const adminIds = [
            interaction.options.getString('adminid1'),
            interaction.options.getString('adminid2'),
            interaction.options.getString('adminid3'),
            interaction.options.getString('adminid4')
        ].filter(Boolean); 

        if (!serverId || antiSpam === null || antiLink === null || antiNuke === null || antiRaid === null || !logChannelId || ownerIds.length < 1 || adminIds.length < 1) {
            return interaction.reply({ content: 'Invalid input. Please provide valid server ID, log channel ID, at least one owner ID, at least one admin ID, and status for all modules.', ephemeral: true });
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

      
            const memberId = interaction.user.id;
            const serverOwners = ownerIds;
            const serverAdmins = adminIds;

            if (!serverOwners.includes(memberId) && !serverAdmins.includes(memberId)) {
                return interaction.reply({ content: 'You do not have permission to use this command. Only owners or admins can configure anti-modules.', ephemeral: true });
            }

         
            if (!config[serverId]) {
             
                const firstServerId = Object.keys(config)[0];
                if (!firstServerId) {
                    return interaction.reply({ content: 'No existing server data to clone from.', ephemeral: true });
                }

                config[serverId] = JSON.parse(JSON.stringify(config[firstServerId]));

           
                config[serverId].logChannelId = logChannelId;
                config[serverId].owners = ownerIds;
                config[serverId].admins = adminIds;
                config[serverId].antiSpam.enabled = antiSpam;
                config[serverId].antiLink.enabled = antiLink;
                config[serverId].antiNuke.enabled = antiNuke;
                config[serverId].antiRaid.enabled = antiRaid;
            } else {
              
                config[serverId].logChannelId = logChannelId;
                config[serverId].owners = ownerIds;
                config[serverId].admins = adminIds;
                config[serverId].antiSpam.enabled = antiSpam;
                config[serverId].antiLink.enabled = antiLink;
                config[serverId].antiNuke.enabled = antiNuke;
                config[serverId].antiRaid.enabled = antiRaid;
            }

            
            fs.writeFile(configPath, JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Error writing config file:', err);
                    return interaction.reply({ content: 'There was an error writing to the config file.', ephemeral: true });
                }

                interaction.reply({ content: `Anti-modules, log channel, owners, and admins updated successfully for server ID ${serverId}.`, ephemeral: true });
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
        .setDescription('- This command can only be used through slash command!\n- Please use `/setantimodules` to setup.')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    },
};
