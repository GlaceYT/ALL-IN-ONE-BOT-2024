const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { antisetupCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('antisetup')
        .setDescription('Configure anti-protection settings')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand
                .setName('initial')
                .setDescription('Initial setup for anti-protection settings')
                .addStringOption(option => option.setName('serverid').setDescription('The ID of the server').setRequired(true))
                .addBooleanOption(option => option.setName('antispam').setDescription('Enable or disable anti-spam module').setRequired(true))
                .addBooleanOption(option => option.setName('antilink').setDescription('Enable or disable anti-link module').setRequired(true))
                .addBooleanOption(option => option.setName('antinuke').setDescription('Enable or disable anti-nuke module').setRequired(true))
                .addBooleanOption(option => option.setName('antiraid').setDescription('Enable or disable anti-raid module').setRequired(true))
                .addStringOption(option => option.setName('logchannelid').setDescription('The ID of the log channel').setRequired(true))
                .addStringOption(option => option.setName('ownerid1').setDescription('The first owner ID').setRequired(true))
                .addStringOption(option => option.setName('ownerid2').setDescription('The second owner ID').setRequired(true))
                .addStringOption(option => option.setName('adminid1').setDescription('The first admin ID').setRequired(true))
                .addStringOption(option => option.setName('adminid2').setDescription('The second admin ID').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('spam')
                .setDescription('Configure anti-spam settings')
                .addBooleanOption(option => option.setName('enabled').setDescription('Enable/disable anti-spam'))
                .addIntegerOption(option => option.setName('messagecount').setDescription('Max messages allowed in time window'))
                .addIntegerOption(option => option.setName('timewindow').setDescription('Time window in ms'))
                .addStringOption(option => option.setName('action').setDescription('Action to take (warn/timeout)'))
                .addIntegerOption(option => option.setName('duration').setDescription('Timeout duration in ms if action is timeout')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('link')
                .setDescription('Configure anti-link settings')
                .addBooleanOption(option => option.setName('enabled').setDescription('Enable/disable anti-link'))
                .addStringOption(option => option.setName('mode').setDescription('Mode (partial/full)'))
                .addIntegerOption(option => option.setName('linkinterval').setDescription('Interval for partial mode in ms')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('nuke')
                .setDescription('Configure anti-nuke settings')
                .addBooleanOption(option => option.setName('enabled').setDescription('Enable/disable anti-nuke'))
                .addIntegerOption(option => option.setName('channeldeletelimit').setDescription('Max channel deletions allowed'))
                .addIntegerOption(option => option.setName('channeldeletetime').setDescription('Time window for channel deletions in ms'))
                .addIntegerOption(option => option.setName('memberkicklimit').setDescription('Max member kicks allowed'))
                .addIntegerOption(option => option.setName('memberbanlimit').setDescription('Max member bans allowed')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('raid')
                .setDescription('Configure anti-raid settings')
                .addBooleanOption(option => option.setName('enabled').setDescription('Enable/disable anti-raid'))
                .addIntegerOption(option => option.setName('joinlimit').setDescription('Max members allowed to join in time window'))
                .addIntegerOption(option => option.setName('timewindow').setDescription('Time window for joins in ms'))
                .addStringOption(option => option.setName('action').setDescription('Action to take (kick/ban)'))),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('You do not have permission to use this command.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        const subcommand = interaction.options.getSubcommand();
        const serverId = interaction.guild.id; 
        const memberId = interaction.user.id;

   
        let guildConfig = await antisetupCollection.findOne({ serverId });

        if (subcommand === 'initial') {
          
            const antiSpam = interaction.options.getBoolean('antispam');
            const antiLink = interaction.options.getBoolean('antilink');
            const antiNuke = interaction.options.getBoolean('antinuke');
            const antiRaid = interaction.options.getBoolean('antiraid');
            const logChannelId = interaction.options.getString('logchannelid');
            const ownerIds = [
                interaction.options.getString('ownerid1'),
                interaction.options.getString('ownerid2')
            ];
            const adminIds = [
                interaction.options.getString('adminid1'),
                interaction.options.getString('adminid2')
            ];

            if (ownerIds.includes(memberId) || adminIds.includes(memberId)) {
                const config = {
                    serverId,
                    logChannelId,
                    owners: ownerIds,
                    admins: adminIds,
                    antiSpam: {
                        enabled: antiSpam,
                        messageCount: 5,
                        timeWindow: 5000,
                        action: "timeout",
                        duration: 60000
                    },
                    antiLink: {
                        enabled: antiLink,
                        mode: "full",
                        linkInterval: 60000
                    },
                    antiNuke: {
                        enabled: antiNuke,
                        channelDeleteLimit: 2,
                        channelDeleteTime: 10000,
                        memberKickLimit: 2,
                        memberBanLimit: 2
                    },
                    antiRaid: {
                        enabled: antiRaid,
                        joinLimit: 5,
                        timeWindow: 60000,
                        action: "kick"
                    }
                };

                try {
                    await antisetupCollection.updateOne(
                        { serverId },
                        { $set: config },
                        { upsert: true }
                    );
                    interaction.reply({ content: `Anti-modules, log channel, owners, and admins updated successfully for server ID ${serverId}.`, ephemeral: true });
                } catch (err) {
                    console.error('Error updating MongoDB:', err);
                    interaction.reply({ content: 'There was an error updating the database.', ephemeral: true });
                }
            } else {
                interaction.reply({ content: 'You do not have permission to use this command. Only owners or admins can configure anti-modules.', ephemeral: true });
            }
        } else {
          
            if (!guildConfig) {
                return interaction.reply({ content: 'This server is not configured. Please run the initial setup first.', ephemeral: true });
            }

            if (!guildConfig.owners.includes(memberId) && !guildConfig.admins.includes(memberId)) {
                return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }

           
            switch (subcommand) {
                case 'spam':
                    guildConfig.antiSpam = {
                        enabled: interaction.options.getBoolean('enabled'),
                        messageCount: interaction.options.getInteger('messagecount'),
                        timeWindow: interaction.options.getInteger('timewindow'),
                        action: interaction.options.getString('action'),
                        duration: interaction.options.getInteger('duration')
                    };
                    break;
                case 'link':
                    guildConfig.antiLink = {
                        enabled: interaction.options.getBoolean('enabled'),
                        mode: interaction.options.getString('mode'),
                        linkInterval: interaction.options.getInteger('linkinterval')
                    };
                    break;
                case 'nuke':
                    guildConfig.antiNuke = {
                        enabled: interaction.options.getBoolean('enabled'),
                        channelDeleteLimit: interaction.options.getInteger('channeldeletelimit'),
                        channelDeleteTime: interaction.options.getInteger('channeldeletetime'),
                        memberKickLimit: interaction.options.getInteger('memberkicklimit'),
                        memberBanLimit: interaction.options.getInteger('memberbanlimit')
                    };
                    break;
                case 'raid':
                    guildConfig.antiRaid = {
                        enabled: interaction.options.getBoolean('enabled'),
                        joinLimit: interaction.options.getInteger('joinlimit'),
                        timeWindow: interaction.options.getInteger('timewindow'),
                        action: interaction.options.getString('action')
                    };
                    break;
                default:
                    break;
            }

            try {
                await antisetupCollection.updateOne(
                    { serverId },
                    { $set: guildConfig },
                    { upsert: true }
                );
                interaction.reply({ content: 'Anti-protection settings updated successfully!', ephemeral: true });
            } catch (err) {
                console.error('Error updating MongoDB:', err);
                interaction.reply({ content: 'There was an error updating the database.', ephemeral: true });
            }
        }

    } else {
        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: "Alert!", 
            iconURL: cmdIcons.dotIcon ,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription('- This command can only be used through slash command!\n- Please use `/setupantimodules`')
        .setTimestamp();
    
        await interaction.reply({ embeds: [embed] });
    
        }  
    }
};
