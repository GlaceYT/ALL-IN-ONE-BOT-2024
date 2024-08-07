const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Wcard } = require('wcard-gen');
const { welcomeCollection } = require('../mongodb');
const data = require('../UI/banners/welcomecards');

async function loadWelcomeConfig() {
    try {
        const configs = await welcomeCollection.find().toArray();
        return configs.reduce((acc, config) => {
            acc[config.serverId] = config;
            return acc;
        }, {});
    } catch (err) {
        //console.error('Error loading welcome config:', err);
        return {};
    }
}

function getOrdinalSuffix(number) {
    if (number === 11 || number === 12 || number === 13) {
        return 'th';
    }
    const lastDigit = number % 10;
    switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function getRandomImage(images) {
    return images[Math.floor(Math.random() * images.length)];
}

module.exports = async (client) => {
    let welcomeConfig = await loadWelcomeConfig();

    setInterval(async () => {
        welcomeConfig = await loadWelcomeConfig();
    }, 5000);

    client.on('guildMemberAdd', async (member) => {
        const guildId = member.guild.id;
        const settings = welcomeConfig[guildId];

        if (settings && settings.status) {
            const welcomeChannel = member.guild.channels.cache.get(settings.welcomeChannelId);
            if (welcomeChannel) {
                const memberCount = member.guild.memberCount;
                const suffix = getOrdinalSuffix(memberCount);
                const userName = member.user.username;
                const joinDate = member.joinedAt.toDateString();
                const creationDate = member.user.createdAt.toDateString();
                const serverName = member.guild.name;
                const serverIcon = member.guild.iconURL({ format: 'png', dynamic: true, size: 256 });
                const randomImage = getRandomImage(data.welcomeImages);

                const welcomecard = new Wcard()
                    .setName(userName)
                    .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
                    .setTitle("Welcome to Server")
                    .setColor("00e5ff") 
                    .setBackground(randomImage);
                
                const card = await welcomecard.build();
                const attachment = new AttachmentBuilder(card, { name: 'welcome.png' });

                const embed = new EmbedBuilder()
                    .setTitle("Welcome to the Server!")
                    .setDescription(`${member}! You are the **${memberCount}${suffix}** member of our server!`)
                    .setColor("#00e5ff")
                    .setThumbnail(member.user.displayAvatarURL())
                    .setImage('attachment://welcome.png')
                    .addFields(
                        { name: 'Username', value: userName, inline: true },
                        { name: 'Join Date', value: joinDate, inline: true },
                        { name: 'Account Created', value: creationDate, inline: true }
                    )
                    .setFooter({ text: "We're glad to have you here!", iconURL: serverIcon })
                    .setAuthor({ name: serverName, iconURL: serverIcon })
                    .setTimestamp();

                welcomeChannel.send({
                    content: `Hey ${member}!`,
                    embeds: [embed],
                    files: [attachment]
                });
            }
        }
    });
};
