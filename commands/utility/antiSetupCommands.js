const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const antisetup = require('../../antisetup.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antisetup')
        .setDescription('Configure anti-protection settings')
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
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;
        const guildConfig = antisetup[guildId];
        
        if (!guildConfig) {
            return interaction.reply({ content: 'This server is not configured.', ephemeral: true });
        }

        if (!guildConfig.owners.includes(userId) && !guildConfig.admins.includes(userId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

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

        fs.writeFileSync('antisetup.json', JSON.stringify(antisetup, null, 4));
        interaction.reply('Anti-protection settings updated successfully!');
    }
};
