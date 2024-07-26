const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('./../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or playlist in your voice channel')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The link or name of the song or playlist')
                .setRequired(true)),
    async execute(interaction) {
        let input;

        if (interaction.isCommand && interaction.isCommand()) {
            // Slash command execution
            input = interaction.options.getString('input');
        } else {
            // Prefix command execution
            const args = interaction.content.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            if (command === 'play') {
                input = args.join(' ');
            }
        }

        if (!input) {
            return interaction.reply('You need to provide the link or name of the song or playlist!');
        }

        return executePlay(interaction, input);
    },
};

async function executePlay(interaction, input) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
        return interaction.reply('You need to be in a voice channel to play music!');
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return interaction.reply('I need the permissions to join and speak in your voice channel!');
    }

    try {
        await interaction.reply(`💎** Searching and Playing: ${input}**`);
        
        if (isPlaylist(input)) {
            await interaction.client.distube.playlist(voiceChannel, input, {
                textChannel: interaction.channel,
                member: interaction.member,
            });
        } else {
            await interaction.client.distube.play(voiceChannel, input, {
                textChannel: interaction.channel,
                member: interaction.member,
            });
        }
    } catch (error) {
        console.error(error);
        await interaction.editReply('An error occurred while trying to play the song or playlist.');
    }
}

function isPlaylist(input) {
    const playlistPatterns = [
        /playlist\?list=/i, // YouTube playlist pattern
        /open\.spotify\.com\/playlist\//i, // Spotify playlist pattern
        /spotify:playlist:/i // Spotify playlist URI pattern
    ];
    return playlistPatterns.some(pattern => pattern.test(input));
}
