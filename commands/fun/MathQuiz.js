const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, MessageCollector } = require('discord.js');

let activeQuizzes = new Map();
let lastPermissionMessage = null;

function generateQuestion() {
    let num1 = Math.floor(Math.random() * 100) + 1;
    let num2 = Math.floor(Math.random() * 100) + 1;
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let question, answer;

    switch (operation) {
        case '+':
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
            break;
        case '-':
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            question = `${num1} - ${num2}`;
            answer = num1 - num2;
            break;
    }

    return { question, answer };
}

async function deleteQuizMessages(quizData) {
    if (quizData.messages) {
        for (const msg of quizData.messages) {
            try {
                await msg.delete();
            } catch (err) {
                if (err.code !== 10008) {
                    console.error('Failed to delete message:', err);
                }
            }
        }
    }
    if (lastPermissionMessage) {
        try {
            await lastPermissionMessage.delete();
            lastPermissionMessage = null;
        } catch (err) {
            if (err.code !== 10008) {
                console.error('Failed to delete last permission message:', err);
            }
        }
    }
}

async function endQuiz(interaction, channelId, reason) {
    const quizData = activeQuizzes.get(channelId);

    if (quizData) {
        if (quizData.collector) {
            quizData.collector.stop();
        }
        await deleteQuizMessages(quizData);
        activeQuizzes.delete(channelId);

        const channel = await interaction.client.channels.fetch(channelId);
        if (channel) {
            const endEmbed = new EmbedBuilder()
                .setTitle('📚 Math Quiz Ended! 🧠')
                .setDescription(reason)
                .setColor(0xff0000);

            await channel.send({ embeds: [endEmbed] });
        }
    } else {
        await interaction.reply({ content: 'There is no active quiz to end.', ephemeral: true });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mathquiz')
        .setDescription('Start a math quiz.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a math quiz in this channel.')
        ),
    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();
            const channelId = interaction.channel.id;
            const userId = interaction.user.id;

            if (subcommand === 'start') {
                if (activeQuizzes.has(channelId)) {
                    await interaction.reply({ content: 'There is already an active quiz in this channel.', ephemeral: true });
                    return;
                }

                const quizData = {
                    commandUser: userId,
                    questions: Array.from({ length: 5 }, generateQuestion),
                    currentQuestionIndex: 0,
                    correctAnswers: 0,
                    timeoutCount: 0,
                    collector: null,
                    messages: [],
                };
                activeQuizzes.set(channelId, quizData);

                const startNextQuestion = async () => {
                    if (quizData.currentQuestionIndex >= quizData.questions.length) {
                        await endQuiz(interaction, channelId, `🎉 Quiz completed! You scored ${quizData.correctAnswers}/${quizData.questions.length}.`);
                        return;
                    }

                    const { question, answer } = quizData.questions[quizData.currentQuestionIndex];

                    const quizEmbed = new EmbedBuilder()
                        .setTitle('🧠 Math Quiz Question')
                        .setDescription(`**Question ${quizData.currentQuestionIndex + 1}/5:** What is ${question}? Respond with \`!<your answer>\``)
                        .setColor(0x0099ff)
                        .setFooter({ text: '⏳ You have 30 seconds to answer this question.' });

                    if (quizData.messages.length > 0) {
                        await deleteQuizMessages(quizData);
                        quizData.messages = [];
                    }

                    const message = await interaction.channel.send({ embeds: [quizEmbed] });
                    quizData.messages.push(message);

                    const filter = response => response.content.startsWith('!') && response.channel.id === channelId;
                    quizData.collector = new MessageCollector(interaction.channel, { filter, time: 30000 });

                    quizData.collector.on('collect', async response => {
                        const userAnswer = parseInt(response.content.slice(1).trim(), 10);
                        const correctAnswer = quizData.questions[quizData.currentQuestionIndex].answer;

                        if (response.author.id !== quizData.commandUser) {
                            await response.delete();
                            if (lastPermissionMessage) {
                                await lastPermissionMessage.delete();
                            }
                            lastPermissionMessage = await response.channel.send({ content: `❌ ${response.author} does not have permission to submit answers. Please answer only in your quiz.`, ephemeral: true });
                            return;
                        }

                        clearTimeout(quizData.questionTimer);

                        if (userAnswer === correctAnswer) {
                            quizData.correctAnswers++;
                            await response.reply({ content: '✅ Correct!', ephemeral: true });
                        } else {
                            await response.reply({ content: `❌ Incorrect! The correct answer was ${correctAnswer}.`, ephemeral: true });
                        }

                        quizData.currentQuestionIndex++;
                        quizData.collector.stop();
                        startNextQuestion();
                    });

                    quizData.collector.on('end', async collected => {
                        if (collected.size === 0) {
                            quizData.timeoutCount++;

                            if (quizData.timeoutCount >= 3) {
                                await endQuiz(interaction, channelId, `🛑 The quiz has ended due to inactivity after 3 timeouts.`);
                                return;
                            } else {
                                const timeoutMessage = await interaction.channel.send(`⏳ Time is up! Moving to the ${quizData.currentQuestionIndex + 1}/5 question. ⏭️`);
                                quizData.messages.push(timeoutMessage);
                                quizData.currentQuestionIndex++;
                                startNextQuestion();
                            }
                        }
                    });
                };

                await interaction.reply({ content: '🎉 Math quiz started! Answer the questions with `!<your answer>`.', ephemeral: true });
                startNextQuestion();
            }
        } catch (error) {
            console.error('Error executing math quiz command:', error);
            await interaction.reply({ content: 'There was an error executing the command.', ephemeral: true });
        }
    },
};
