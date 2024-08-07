const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const cmdIcons = require('../../UI/icons/commandicons');
const lang = require('../../events/loadLanguage');
const wordHints = {
    '!apple': 'A common fruit that is red or green.',
    '!banana': 'A long, yellow fruit.',
    '!cat': 'A small, domesticated feline.',
    '!dog': 'A loyal four-legged companion.',
    '!fish': 'A creature that lives in water.',
    '!hat': 'An accessory worn on the head.',
    '!ice': 'Frozen water.',
    '!juice': 'A drink made from fruit.',
    '!kite': 'A flying object with a tail, often used for fun.',
    '!lamp': 'A device that gives off light.',
    '!mouse': 'A small rodent or a computer input device.',
    '!nut': 'A hard-shelled fruit or seed.',
    '!orange': 'A round citrus fruit that is orange in color.',
    '!pen': 'A tool for writing.',
    '!queen': 'A female monarch.',
    '!rose': 'A type of flower with thorns.',
    '!sun': 'The star at the center of our solar system.',
    '!tree': 'A perennial plant with an elongated stem.',
    '!umbrella': 'A device used for protection against rain.',
    '!van': 'A type of vehicle.',
    '!water': 'A clear, colorless liquid essential for life.',
    '!x-ray': 'An imaging technique used to see inside objects.',
    '!yarn': 'A long, continuous length of interlocked fibers.',
    '!zoo': 'A place where animals are kept for public viewing.',
    '!ant': 'A small insect.',
    '!ball': 'A spherical object used in games.',
    '!car': 'A motor vehicle with four wheels.',
    '!door': 'A hinged or sliding barrier.',
    '!egg': 'An oval object laid by birds and reptiles.',
    '!fan': 'A device used for cooling or ventilation.',
    '!goat': 'A domesticated ruminant animal.',
    '!hill': 'A small elevation of the earth’s surface.',
    '!igloo': 'A dome-shaped shelter made of ice blocks.',
    '!jelly': 'A sweet, gelatinous food.',
    '!key': 'A device used to unlock something.',
    '!leaf': 'A flat, green part of a plant.',
    '!moon': 'The natural satellite of Earth.',
    '!nose': 'The part of the face used for smelling and breathing.',
    '!owl': 'A nocturnal bird of prey.',
    '!pig': 'A domesticated animal known for its intelligence.',
    '!rain': 'Water droplets falling from the sky.',
    '!star': 'A luminous celestial body.',
    '!tiger': 'A large, striped wild cat.',
    '!unit': 'A single thing or person.',
    '!vase': 'A container used for holding flowers.',
    '!wind': 'Moving air.',
    '!box': 'A container with flat surfaces and a lid.',
    '!cloud': 'A visible mass of condensed water vapor.',
    '!duck': 'A waterfowl with a broad, flat bill.',
    '!ear': 'The organ used for hearing.',
    '!gift': 'Something given voluntarily without payment.',
    '!hair': 'Thread-like strands growing from the skin.',
    '!ink': 'A colored fluid used for writing or printing.',
    '!jacket': 'A piece of clothing worn on the upper body.',
    '!koala': 'A marsupial native to Australia.',
    '!mug': 'A cup with a handle used for drinking.',
    '!notebook': 'A book of blank pages used for writing.',
    '!paint': 'A colored substance used for decorating.',
    '!sock': 'A garment worn on the foot.',
    '!train': 'A series of connected vehicles traveling on a track.',
    '!under': 'Located below something.',
    '!vacuum': 'A device used for cleaning carpets and floors.',
    '!wolf': 'A wild carnivorous animal.',
    '!xylophone': 'A musical instrument with wooden bars.',
    '!yawn': 'An involuntary opening of the mouth due to tiredness.',
    '!zebra': 'A striped African animal.',
    '!beach': 'A sandy shore by the sea.',
    '!cake': 'A sweet baked dessert.',
    '!elephant': 'A large mammal with a trunk.',
    '!flag': 'A piece of fabric used as a symbol or signal.',
    '!grape': 'A small, round fruit, often purple or green.',
    '!house': 'A building for human habitation.',
    '!jam': 'A sweet spread made from fruit and sugar.',
    '!lemon': 'A sour, yellow citrus fruit.',
    '!octopus': 'A marine animal with eight arms.',
    '!penguin': 'A flightless bird that lives in the Southern Hemisphere.',
    '!quilt': 'A warm bed covering made of padding enclosed between layers of fabric.',
    '!rainbow': 'An arc of colors formed by the refraction of light.',
    '!sand': 'A loose granular substance found on beaches and deserts.',
    '!teddy': 'A soft stuffed toy bear.',
    '!unicorn': 'A mythical horse-like creature with a single horn.',
    '!violet': 'A color between blue and purple.',
    '!whale': 'A large marine mammal.',
    '!yellow': 'A bright color between green and orange.',
    '!airplane': 'A powered flying vehicle.',
    '!book': 'A set of written or printed pages bound together.',
    '!cookie': 'A sweet baked treat.',
    '!drum': 'A musical instrument with a membrane stretched over a frame.',
    '!eggplant': 'A glossy purple fruit.',
    '!honey': 'A sweet substance produced by bees.',
    '!kiwi': 'A small, brown, fuzzy fruit with green flesh.',
    '!lollipop': 'A sweet on a stick.',
    '!mango': 'A sweet tropical fruit.',
    '!ninja': 'A skilled fighter from Japanese tradition.',
    '!piano': 'A large musical instrument with black and white keys.',
    '!quack': 'The sound made by a duck.',
    '!rocket': 'A vehicle designed to travel in space.',
    '!swing': 'A seat suspended from ropes or chains.',
    '!taco': 'A Mexican dish consisting of a folded tortilla.',
    '!volcano': 'An opening in the earth’s crust through which lava erupts.',
    '!watermelon': 'A large fruit with a green rind and red flesh.',
    '!yogurt': 'A creamy dairy product made from fermented milk.',
    '!candy': 'A sweet confection.',
    '!dinosaur': 'A prehistoric reptile.',
    '!frog': 'A small amphibian with long legs.',
    '!giraffe': 'A tall African animal with a long neck.',
    '!hummingbird': 'A tiny bird known for its hovering flight.',
    '!icecream': 'A frozen dairy dessert.',
    '!jungle': 'A dense forest found in tropical regions.',
    '!kangaroo': 'A large marsupial from Australia.',
    '!lemonade': 'A drink made from lemon juice, water, and sugar.',
    '!monkey': 'A primate known for its playful behavior.',
    '!napkin': 'A piece of cloth or paper used for wiping hands and mouth.',
    '!peach': 'A juicy fruit with a fuzzy skin.',
    '!robot': 'A mechanical device capable of carrying out tasks.',
    '!sunflower': 'A tall plant with a large yellow flower.',
    '!vegetable': 'A plant or part of a plant used as food.',
    '!whistle': 'A device that produces a high-pitched sound.',
    '!art': 'Creative work that expresses ideas or emotions.',
    '!bread': 'A staple food made from flour and water.',
    '!candle': 'A stick of wax with a wick that burns to provide light.',
    '!doll': 'A toy that resembles a human.',
    '!envelope': 'A flat, usually rectangular, paper container for a letter.',
    '!feather': 'A light, flat structure that covers birds.',
    '!guitar': 'A stringed musical instrument.',
    '!muffin': 'A small baked good, typically sweet.',
    '!socks': 'Garments worn on the feet.',
    '!window': 'An opening in a wall for light and air.'
    
};

let currentWord = '';
let chances = 3; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wordassociation')
        .setDescription(lang.wordAssociationDescription), // Use localized description
    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) { 
           

        if (!interaction.guild) {
            return interaction.reply({ content: lang.serverOnlyMessage, ephemeral: true });
        }

        const commandUser = interaction.user;
        let currentWord = getRandomWord();

        const botMember = await interaction.guild.members.fetch(interaction.client.user.id);
        if (!botMember) {
            return interaction.reply({ content: lang.fetchBotMemberError, ephemeral: true });
        }

        const requiredPermissions = [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageChannels,
        ];

        const botPermissions = botMember.permissionsIn(interaction.channel);
        const missingPermissions = requiredPermissions.filter(permission => !botPermissions.has(permission));

        if (missingPermissions.length > 0) {
            const permissionNames = missingPermissions.map(permission => {
                switch (permission) {
                    case PermissionsBitField.Flags.ViewChannel:
                        return lang.viewChannelsPermission;
                    case PermissionsBitField.Flags.SendMessages:
                        return lang.sendMessagesPermission;
                    case PermissionsBitField.Flags.ManageChannels:
                        return lang.manageChannelsPermission;
                    default:
                        return lang.unknownPermission;
                }
            }).join(', ');

            return interaction.reply({ content: `${lang.missingPermissionsMessage} ${permissionNames}. ${lang.adjustPermissions}`, ephemeral: true });
        }

        const existingChannel = interaction.guild.channels.cache.find(channel => channel.name === `word-association-${commandUser.username.toLowerCase()}`);
        if (existingChannel) {
            return interaction.reply({ content: `${lang.existingGameMessage} ${existingChannel}. ${lang.finishCurrentGame}`, ephemeral: true });
        }

        let tempChannel;
        try {
            tempChannel = await interaction.guild.channels.create({
                name: `word-association-${commandUser.username.toLowerCase()}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: commandUser.id,
                        allow: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            });
        } catch (error) {
            if (!interaction.replied) {
                await interaction.reply({ content: lang.channelCreationError, ephemeral: true });
            }
            return;
        }

        await tempChannel.send(`${commandUser} ${lang.gameStartMessage} \n ${lang.hintMessage} **${wordHints[currentWord]}**`);

        try {
            await commandUser.send(`${lang.wordIsMessage} **${currentWord}** ${lang.keepSecret}`);
        } catch (error) {
            if (!interaction.replied) {
                await interaction.reply({ content: lang.dmSendError, ephemeral: true });
            }
            await tempChannel.delete().catch(console.error);
            return;
        }

        if (!interaction.replied) {
            await interaction.reply({ content: `${lang.gameStartedMessage} ${tempChannel}. ${lang.goodLuck}`, ephemeral: true });
        }

        const filter = message => message.channel.id === tempChannel.id;
        const collector = tempChannel.createMessageCollector({ filter, time: 300000 }); // 5 minutes

        collector.on('collect', async message => {
            const userWord = message.content.trim().toLowerCase();
            const userId = message.author.id;

            if (userId === commandUser.id) {
                if (userWord.startsWith('!')) {
                    await message.delete().catch(console.error);
                    await message.author.send(lang.noCommandsMessage).catch(console.error);
                    return;
                }
                return;
            }

            if (userWord.startsWith('!')) {
                if (userWord === currentWord) {
                    currentWord = getRandomWord();
                    await tempChannel.send(`${lang.goodChoiceMessage} ${message.author}! ${lang.wordUpdatedMessage}\n${lang.hintMessage}: ${wordHints[currentWord]}`);
                    try {
                        await commandUser.send(`${lang.newWordMessage} **${currentWord}**`);
                    } catch (error) {
                        // Handle DM error if necessary
                    }
                } else {
                    await tempChannel.send(`${message.author}, "${userWord}" ${lang.notRelatedMessage}`);
                }
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                commandUser.send(lang.noResponseMessage);
            } else {
                tempChannel.send(lang.gameEndMessage);
            }
            tempChannel.delete().catch(console.error);
        });

    }else { const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setAuthor({ 
            name: lang.alertTitle, 
            iconURL: cmdIcons.dotIcon,
            url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription(lang.commandUsageMessage)
        .setTimestamp();

    return interaction.reply({ embeds: [embed] });
}
    }
};

function getRandomWord() {
    const words = Object.keys(wordHints);
    return words[Math.floor(Math.random() * words.length)];
}

function isRelated(word1, word2) {
    return word1.length === word2.length; 
}