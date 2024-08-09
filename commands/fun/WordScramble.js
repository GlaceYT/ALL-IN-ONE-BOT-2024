const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const scrambleWord = word => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
};

const words = [
    'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon',
    'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vine',
    'watermelon', 'xigua', 'yam', 'zucchini', 'avocado', 'blueberry', 'cantaloupe', 'dragonfruit', 'grapefruit', 'huckleberry',
    'jackfruit', 'kiwano', 'lime', 'melon', 'nectar', 'olive', 'pear', 'plum', 'pomegranate', 'rhubarb',
    'starfruit', 'tomato', 'apricot', 'blackberry', 'coconut', 'cucumber', 'gooseberry', 'pear', 'persimmon', 'pineapple',
    'pomegranate', 'quince', 'raspberry', 'strawberry', 'tamarind', 'banana', 'kiwi', 'fig', 'dates', 'grapefruit',
    'grapes', 'lemon', 'lime', 'melon', 'mango', 'nectarine', 'peach', 'plum', 'papaya', 'passionfruit',
    'peach', 'pear', 'pineapple', 'plum', 'pomegranate', 'tangerine', 'watermelon', 'zucchini', 'eggplant', 'onion',
    'tomato', 'cucumber', 'bellpepper', 'broccoli', 'carrot', 'cauliflower', 'celery', 'corn', 'spinach', 'garlic',
    'ginger', 'kale', 'lettuce', 'mushroom', 'pumpkin', 'radish', 'squash', 'sweetpotato', 'turnip', 'beet',
    'artichoke', 'asparagus', 'bean', 'brusselsprout', 'cabbage', 'chard', 'chili', 'dandelion', 'edamame', 'jalapeno',
    'leek', 'olives', 'parsley', 'pea', 'potato', 'rhubarb', 'shallot', 'snowpea', 'sprout', 'swisschard',
    'taro', 'tomatillo', 'watercress', 'yarrow', 'zucchini', 'yam', 'jicama', 'daikon', 'chayote', 'yogurt',
    'cheddar', 'mozzarella', 'parmesan', 'brie', 'camembert', 'feta', 'gouda', 'ricotta', 'blue', 'goat',
    'cottage', 'cream', 'gruyere', 'provolone', 'swiss', 'havarti', 'american', 'colby', 'jack', 'queso'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scramble')
        .setDescription('Starts a word scramble game with a scrambled word.'),
    async execute(interaction) {
        const word = words[Math.floor(Math.random() * words.length)];
        const scrambledWord = scrambleWord(word);
        const scrambleEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Word Scramble!')
            .setDescription(`Unscramble the word: **${scrambledWord}**`)
            .setFooter({ text: 'Type your answer below.' });

        await interaction.reply({ embeds: [scrambleEmbed] });

        const filter = response => {
            return response.author.id === interaction.user.id;
        };
        try {
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
            const userAnswer = collected.first().content;

            if (userAnswer.toLowerCase() === word.toLowerCase()) {
                await interaction.followUp('Correct! 🎉');
            } else {
                await interaction.followUp(`Wrong! The correct word was: ${word}`);
            }
        } catch (error) {
            await interaction.followUp('You took too long to answer!');
        }
    },
};
