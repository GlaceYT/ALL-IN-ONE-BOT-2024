const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { performance } = require('perf_hooks'); 

async function getLeven() {
    return (await import('leven')).default;
}

const sampleParagraphs = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "A watched pot never boils.",
    "The pen is mightier than the sword.",
    "Actions speak louder than words.",
    "Birds of a feather flock together.",
    "Better late than never.",
    "A stitch in time saves nine.",
    "Barking up the wrong tree.",
    "Beauty is in the eye of the beholder.",
    "Break the ice.",
    "Curiosity killed the cat.",
    "Don't count your chickens before they hatch.",
    "Every cloud has a silver lining.",
    "Fortune favors the bold.",
    "Give the benefit of the doubt.",
    "Hit the nail on the head.",
    "If it ain't broke, don't fix it.",
    "In the nick of time.",
    "It's not rocket science.",
    "Let the cat out of the bag.",
    "No pain, no gain.",
    "Once in a blue moon.",
    "Put all your eggs in one basket.",
    "Raining cats and dogs.",
    "Read between the lines.",
    "Speak of the devil.",
    "The early bird catches the worm.",
    "The grass is always greener on the other side.",
    "Time flies when you're having fun.",
    "When in Rome, do as the Romans do.",
    "You can't judge a book by its cover.",
    "A penny for your thoughts.",
    "Actions speak louder than words.",
    "All's fair in love and war.",
    "An apple a day keeps the doctor away.",
    "Beggars can't be choosers.",
    "Better safe than sorry.",
    "Cleanliness is next to godliness.",
    "Don't bite the hand that feeds you.",
    "Don't cry over spilt milk.",
    "Don't put all your eggs in one basket.",
    "Easy come, easy go.",
    "Every dog has its day.",
    "Give someone the cold shoulder.",
    "He who laughs last laughs best.",
    "Honesty is the best policy.",
    "If the shoe fits, wear it.",
    "It's always darkest before the dawn.",
    "Jack of all trades, master of none.",
    "Let sleeping dogs lie.",
    "Money doesn't grow on trees.",
    "No news is good news.",
    "Practice makes perfect.",
    "Rome wasn't built in a day.",
    "The best of both worlds.",
    "The squeaky wheel gets the grease.",
    "There's no place like home.",
    "Time heals all wounds.",
    "To err is human, to forgive divine.",
    "Too many cooks spoil the broth.",
    "Turn a blind eye.",
    "Variety is the spice of life.",
    "When the going gets tough, the tough get going.",
    "You can't have your cake and eat it too.",
    "You win some, you lose some.",
    "A bird in the hand is worth two in the bush.",
    "A rolling stone gathers no moss.",
    "A watched pot never boils.",
    "Beggars can't be choosers.",
    "Better to have loved and lost than never to have loved at all.",
    "Blood is thicker than water.",
    "By the skin of your teeth.",
    "Every rose has its thorn.",
    "Give someone the benefit of the doubt.",
    "Half a loaf is better than none.",
    "Honesty is the best policy.",
    "If it sounds too good to be true, it probably is.",
    "If you can't beat them, join them.",
    "It's not the size of the dog in the fight, it's the size of the fight in the dog.",
    "Keep your friends close and your enemies closer.",
    "Knowledge is power.",
    "Let bygones be bygones.",
    "Make hay while the sun shines.",
    "Necessity is the mother of invention.",
    "No man is an island.",
    "Nothing ventured, nothing gained.",
    "Once bitten, twice shy.",
    "Out of sight, out of mind.",
    "Practice what you preach.",
    "Rome wasn't built in a day.",
    "Slow and steady wins the race.",
    "The early bird catches the worm.",
    "The grass is always greener on the other side.",
    "The pen is mightier than the sword.",
    "There's no time like the present.",
    "Time and tide wait for no man.",
    "To each their own.",
    "Two heads are better than one.",
    "When in Rome, do as the Romans do.",
    "You can lead a horse to water, but you can't make it drink.",
    "You can't have your cake and eat it too."
];

function generateRandomParagraph() {
    const randomIndex = Math.floor(Math.random() * sampleParagraphs.length);
    return sampleParagraphs[randomIndex];
}

async function generateImageWithText(text) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    const imagePath = path.join(__dirname, '..', '..', 'whitepaper.png'); 
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.font = '30px Arial';
    ctx.fillStyle = 'black'; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toBuffer();
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('typingrace')
        .setDescription('Start a public typing race challenge!'),
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        await interaction.deferReply();

        try {
            const paragraph = generateRandomParagraph();
            const imageBuffer = await generateImageWithText(paragraph);

            const embed = new EmbedBuilder()
                .setTitle('Typing Race Challenge! 🏁')
                .setDescription('Type the sentence in the image as fast as you can! Good luck everyone! 🍀')
                .setColor('#00FF00')
                .setImage('attachment://sentence.png') 
                .setFooter({ text: 'Make sure to type the sentence correctly!' });

            await interaction.editReply({
                content: `Typing Race Challenge! 🏁`,
                embeds: [embed],
                files: [{ attachment: imageBuffer, name: 'sentence.png' }]
            });

            const leven = await getLeven(); 
            const filter = response => {
                const normalizedResponse = response.content.trim().toLowerCase().replace('.', '');
                const normalizedParagraph = paragraph.trim().toLowerCase().replace('.', '');
                const distance = leven(normalizedResponse, normalizedParagraph);
                return distance <= Math.max(normalizedResponse.length, normalizedParagraph.length) * 0.2; // Adjust tolerance here
            };

            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

            let winner = null;
            const startTime = performance.now(); 

            collector.on('collect', (msg) => {
                if (!winner) {
                    winner = msg.author;
                    const endTime = performance.now();
                    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); 
                    const wordsPerMinute = ((paragraph.split(' ').length / (timeTaken / 60)).toFixed(2));
                    const accuracy = (100 - (leven(msg.content.trim().toLowerCase().replace('.', ''), paragraph.trim().toLowerCase().replace('.', '')) / paragraph.length * 100)).toFixed(2);

                    collector.stop();

                    const resultEmbed = new EmbedBuilder()
                        .setTitle('Typing Race Results')
                        .setDescription(`${winner} finished the race! 🏆`)
                        .addFields(
                            { name: 'Time', value: `${timeTaken} seconds`, inline: true },
                            { name: 'Words per Minute', value: `${wordsPerMinute}`, inline: true },
                            { name: 'Accuracy', value: `${accuracy}%`, inline: true }
                        )
                        .setColor('#00FF00')
                        .setFooter({ text: 'Great job!' })
                        .setImage('attachment://sentence.png'); 

                    interaction.followUp({ embeds: [resultEmbed] });
                }
            });

            collector.on('end', collected => {
                if (!winner) {
                    const timeoutEmbed = new EmbedBuilder()
                        .setTitle('Typing Race Timeout')
                        .setDescription(`⏳ Time's up! No one typed the sentence correctly.`)
                        .setColor('#FF0000');
                    
                    interaction.followUp({ embeds: [timeoutEmbed] });
                }
            });
        } catch (error) {
            console.error('Error executing the typing race command:', error);
            await interaction.editReply('There was an error while executing this command!');
        }
    },
};
