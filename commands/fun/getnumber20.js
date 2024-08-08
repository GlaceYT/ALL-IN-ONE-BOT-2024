const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const activeGames = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getnumber20')
        .setDescription('A game where you have to reach the number 20 before your opponent!')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Play mode')
                .setRequired(true)
                .addChoices(
                    { name: 'VS Bot', value: 'vsbot' },
                    { name: 'VS User', value: 'vsuser' }
                )
        )
        .addUserOption(option =>
            option.setName('opponent')
                .setDescription('The user you want to play against.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const serverId = interaction.guild.id;
        const mode = interaction.options.getString('mode');
        const opponent = interaction.options.getUser('opponent') || interaction.client.user;
        const targetScore = 20;

        if (mode === 'vsbot' && opponent.id !== interaction.client.user.id) {
            return interaction.reply({ content: '🚫 You cannot mention an opponent when playing against the bot.', ephemeral: true });
        }

        if (mode === 'vsuser' && opponent.id === interaction.client.user.id) {
            return interaction.reply({ content: '🚫 You cannot play against the bot in VS User mode. Please choose a different opponent.', ephemeral: true });
        }

        if (activeGames[serverId]) {
            return interaction.reply({
                content: '🚫 A game is already in progress in this server! Please wait for the current game to finish before starting a new one.',
                ephemeral: true
            });
        }

        const startingUserId = mode === 'vsbot' ? interaction.user.id : Math.random() < 0.5 ? interaction.user.id : opponent.id;

        activeGames[serverId] = {
            gameEnded: false,
            currentTurnUserId: startingUserId,
            score: 0,
            lastMoveTime: Date.now(),
            inactivityTimer: null,
            interaction: interaction,
            opponent: opponent,
            mode: mode
        };

        await interaction.deferReply();

        const gameInstructionsEmbed = new EmbedBuilder()
            .setTitle('🎮 Game Instructions')
            .setDescription(
                `**Objective:**\nReach the number **${targetScore}** before your opponent.\n\n` +
                `**How to Play:**\n- On your turn, add **1** or **2** to the current score.\n` +
                `- The game alternates turns between you and your opponent.\n` +
                `- The first to reach **${targetScore}** wins!\n\n` +
                `**Game Rules:**\n- You can only add **1** or **2** to the score each turn.\n` +
                `- If you make an invalid move or it’s not your turn, you will receive a message explaining the issue.\n` +
                `- If there is inactivity for 5 minutes, the game will end automatically.\n\n` +
                `**Example Turn:**\n` +
                `- If the current score is **5**, you can choose **6** or **7** as your move.\n` +
                `- If you choose **6**, the new score will be **6**, and it will be the opponent's turn next.\n` +
                `- Keep adding **1** or **2** until someone reaches **${targetScore}**!\n\n` +
                `Good luck and have fun! 🎉`
            )
            .setColor('#00FF00')
            .setFooter({ text: 'Type a number to start playing!' })
            .setTimestamp();

        const gameStartEmbed = new EmbedBuilder()
            .setTitle('🎮 Game Started')
            .setDescription(
                `${interaction.user.username} vs ${mode === 'vsbot' ? 'Bot' : opponent.username}\n` +
                `First to reach ${targetScore} wins!\n\n` +
                `🔄 It's <@${activeGames[serverId].currentTurnUserId}>'s turn!`
            )
            .setColor('#00FF00')
            .setFooter({ text: 'Type a number to play!' })
            .setTimestamp();

        await interaction.editReply({ embeds: [gameInstructionsEmbed, gameStartEmbed] });

        const filter = m => [interaction.user.id, opponent.id].includes(m.author.id) && !isNaN(m.content) && m.content.trim() !== '';
        const collector = interaction.channel.createMessageCollector({ filter, time: 300000 });

        const resetInactivityTimer = () => {
            if (!activeGames[serverId] || activeGames[serverId].gameEnded) return;

            clearTimeout(activeGames[serverId].inactivityTimer);
            activeGames[serverId].inactivityTimer = setTimeout(async () => {
                if (!activeGames[serverId] || activeGames[serverId].gameEnded) return;

                activeGames[serverId].gameEnded = true;

                const endEmbed = new EmbedBuilder()
                    .setTitle('⏳ Game Ended')
                    .setDescription('The game has ended due to inactivity. No one responded in 5 minutes.')
                    .setColor('#FF0000')
                    .setFooter({ text: 'Try again later!' })
                    .setTimestamp();

                await interaction.followUp({ embeds: [endEmbed] });
                delete activeGames[serverId];
            }, 300000);
        };

        const makeBotMove = () => {
            let botChoice = activeGames[serverId].score + (Math.random() < 0.5 ? 1 : 2);
            if (botChoice > targetScore) botChoice = targetScore;
            return botChoice;
        };

        const takeBotTurn = async () => {
            if (!activeGames[serverId] || activeGames[serverId].gameEnded) return;

            const botChoice = makeBotMove();
            activeGames[serverId].score = botChoice;

            await interaction.channel.send({ content: `The bot chooses ${botChoice}` });

            if (activeGames[serverId].score >= targetScore) {
                activeGames[serverId].gameEnded = true;
                collector.stop();

                const winEmbed = new EmbedBuilder()
                    .setTitle('🏆 The Bot Wins!')
                    .setDescription(`Congratulations! 🎉 The Bot reached ${targetScore} first!\n\nFinal score: ${activeGames[serverId].score}`)
                    .setColor('#FFD700')
                    .setTimestamp();

                await interaction.followUp({ content: `<@${interaction.client.user.id}>`, embeds: [winEmbed] });
                delete activeGames[serverId];
            } else {
                activeGames[serverId].currentTurnUserId = interaction.user.id;

                const turnEmbed = new EmbedBuilder()
                    .setTitle('🔄 Next Turn')
                    .setDescription(`It's <@${activeGames[serverId].currentTurnUserId}>'s turn! Current score: ${activeGames[serverId].score}`)
                    .setColor('#00FF00')
                    .setFooter({ text: 'Type a number to play!' })
                    .setTimestamp();

                await interaction.followUp({ content: `<@${activeGames[serverId].currentTurnUserId}>`, embeds: [turnEmbed] });

                resetInactivityTimer();
            }
        };

        const handleUserTurn = async (m) => {
            if (!activeGames[serverId] || activeGames[serverId].gameEnded) return;

            const userId = m.author.id;
            let userChoice = parseInt(m.content);
            const minNumber = activeGames[serverId].score + 1;
            const maxNumber = activeGames[serverId].score + 2;

            if (userId !== activeGames[serverId].currentTurnUserId) {
                const replyMessage = await m.reply({ content: `🚫 It's not your turn! Please wait for <@${activeGames[serverId].currentTurnUserId}>'s turn.`, ephemeral: true });
                setTimeout(() => replyMessage.delete(), 10000);
                return;
            }

            if (userChoice < minNumber || userChoice > maxNumber) {
                const replyMessage = await m.reply({ content: `🚫 You can only add 1 or 2 to the current score. Please choose a valid number between ${minNumber} and ${maxNumber}.`, ephemeral: true });
                setTimeout(() => replyMessage.delete(), 10000);
                return;
            }

            activeGames[serverId].score = userChoice;
            activeGames[serverId].lastMoveTime = Date.now();

            if (activeGames[serverId].score >= targetScore) {
                activeGames[serverId].gameEnded = true;
                collector.stop();

                const winEmbed = new EmbedBuilder()
                    .setTitle('🏆 Congratulations!')
                    .setDescription(`🎉 ${m.author.username} reached ${targetScore} first and won the game!\n\nFinal score: ${activeGames[serverId].score}`)
                    .setColor('#FFD700')
                    .setTimestamp();

                await interaction.followUp({ embeds: [winEmbed] });
                delete activeGames[serverId];
            } else {
                activeGames[serverId].currentTurnUserId = activeGames[serverId].currentTurnUserId === interaction.user.id ? opponent.id : interaction.user.id;

                const turnEmbed = new EmbedBuilder()
                    .setTitle('🔄 Next Turn')
                    .setDescription(`It's <@${activeGames[serverId].currentTurnUserId}>'s turn! Current score: ${activeGames[serverId].score}`)
                    .setColor('#00FF00')
                    .setFooter({ text: 'Type a number to play!' })
                    .setTimestamp();

                await interaction.followUp({ content: `<@${activeGames[serverId].currentTurnUserId}>`, embeds: [turnEmbed] });

                resetInactivityTimer();

                if (activeGames[serverId].mode === 'vsbot' && activeGames[serverId].currentTurnUserId === interaction.client.user.id) {
                    await takeBotTurn();
                }
            }
        };

        collector.on('collect', handleUserTurn);
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                if (!activeGames[serverId] || activeGames[serverId].gameEnded) return;

                activeGames[serverId].gameEnded = true;

                const endEmbed = new EmbedBuilder()
                    .setTitle('⏳ Game Ended')
                    .setDescription('The game has ended due to inactivity. No one responded in 5 minutes.')
                    .setColor('#FF0000')
                    .setFooter({ text: 'Try again later!' })
                    .setTimestamp();

                interaction.followUp({ embeds: [endEmbed] });
                delete activeGames[serverId];
            }
        });

        resetInactivityTimer();
    },
};
