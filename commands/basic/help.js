const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

const commandFolders = ['anime', 'basic', 'fun', 'moderation', 'utility', 'music'];
const enabledCategories = config.excessCommands;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of commands'),

    async execute(interaction) {
        const supportServerLink = "https://discord.gg/xQF9f9yUEM";
        const githubLink = "https://github.com/GlaceYT";
        const replitLink = "https://replit.com/@GlaceYT";

        const createSlashCommandPages = () => {
            const pages = [
                {
                    title: "Bot Information",
                    description: `This bot offers a comprehensive suite of commands designed to enhance your Discord server experience. It seamlessly integrates both prefix and slash commands\n\n` +
                        `**Developed By:** GlaceYT\n` +
                        `**Version:** 1.0.0\n` +
                        `**Node Version:** v20.12.2\n` +
                        `**Discord.js Version:** 14.15.3\n\n` +
                        `**Features:**\n` +
                        "- Moderation tools for managing your server\n" +
                        "- Fun commands to entertain your members\n" +
                        "- Multiple music systems for listening to music\n" +
                        "- Utility commands for various practical tasks\n" +
                        "- Anime / Hentai / Meme commands \n\n" +
                        `**Usage:**\n` +
                        "Use slash commands or prefix commands to invoke bot commands.\n\n",
                    commands: [
                        "\nJoin our Discord server - [Discord](https://discord.gg/xQF9f9yUEM)\n\n" +
                        "**Follow us on:**\n" +
                        "- My GitHub Page: [GitHub](https://github.com/GlaceYT)\n" +
                        "- Other bot source: [Replit](https://replit.com/@GlaceYT)\n" +
                        "- Check out My channel: [YouTube](https://www.youtube.com/@GlaceYT)"
                    ],
                    image: "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&",
                    color: "#3498db",
                    thumbnail: "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&",
                    author: {
                        name: "ALL IN ONE BOT",
                        iconURL: "https://cdn.discordapp.com/attachments/1230824451990622299/1253655046835408917/2366-discord-developers.gif?ex=6676a4be&is=6675533e&hm=0b39917ea5a274d222a001017886e3b43725191f671b34efe5349f82be57968c&",
                        url: "https://discord.gg/xQF9f9yUEM"
                    }
                }
            ];

            const commandData = {};

            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(path.join(__dirname, `../../commands/${folder}`)).filter(file => file.endsWith('.js'));
                commandData[folder] = commandFiles.map(file => {
                    const command = require(`../../commands/${folder}/${file}`);
                    return command.data.name;
                });
            }

            for (const [category, commands] of Object.entries(commandData)) {
                const page = {
                    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                    description: `**Total Commands : **${commands.length}\n` +
                        `**Usage : **Slashcommands\n\n` +
                        `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                    commands: commands.map(command => `\`\`${command}\`\``),
                    image: "",
                    color: "#3498db",
                    thumbnail: "",
                    author: {
                        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        iconURL: "",
                        url: "https://discord.gg/xQF9f9yUEM"
                    }
                };

                switch (category) {
                    case 'anime':
                        page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1253714802048499752/1111.gif?ex=6676dc65&is=66758ae5&hm=9bc3f45ed4930d62def2369c6a27fdd65f24df0fdbe557a7ff7d330090eac1bf&";
                        page.color = "#ff66cc";
                        page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                        page.author.iconURL = "https://cdn.discordapp.com/attachments/1246408947708072027/1255167194036437093/1558-zerotwo-exciteddance.gif?ex=667c250a&is=667ad38a&hm=09e6db36fd79436eb57de466589f21ca947329edd69b8e591d0f6586b89df296&";
                        break;
                    case 'basic':
                        page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                        page.color = "#99ccff";
                        page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                        page.author.iconURL = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                        break;
                    case 'fun':
                        page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                        page.color = "#ffcc00";
                        page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                        page.author.iconURL = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                        break;
                        case 'moderation':
                            page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                            break;
                        case 'utility':
                            page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                            page.color = "#00cc99";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1255164064192270418/2861-tool.gif?ex=667c2220&is=667ad0a0&hm=17d2f57af30831b62639fd3d06853a7bc423e1a96b36e5994f432b65aa9f30dc&";
                            break;
                        case 'music':
                            page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                            page.color = "#020202";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1255146656882622554/8693-youtube-music.png?ex=667c11ea&is=667ac06a&hm=b81b2b2d294019d1c647069c9fa4f4ed09d4d3403aa8fdae2555ff6c1c88e0a9&";
                            break;
                        default:
                            break;
                    }
    
                    pages.push(page);
                }
    
                return pages;
            };
    
            const createPrefixCommandPages = () => {
                const pages = [];
    
                const prefixCommands = {};
    
                for (const [category, isEnabled] of Object.entries(enabledCategories)) {
                    if (isEnabled) {
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../excesscommands/${category}`)).filter(file => file.endsWith('.js'));
                        prefixCommands[category] = commandFiles.map(file => {
                            const command = require(`../../excesscommands/${category}/${file}`);
                            return {
                                name: command.name,
                                description: command.description
                            };
                        });
                    }
                }
    
                for (const [category, commands] of Object.entries(prefixCommands)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Prefix commands with \`${config.prefix}\`\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command.name}\`\``),
                        image: "",
                        color: "",
                        thumbnail: "",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            iconURL: "",
                            url: "https://discord.gg/xQF9f9yUEM"
                        }
                    };
    
                    switch (category) {
                        case 'utility':
                            page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                            page.color = "#00cc99";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1255164064192270418/2861-tool.gif?ex=667c2220&is=667ad0a0&hm=17d2f57af30831b62639fd3d06853a7bc423e1a96b36e5994f432b65aa9f30dc&";
                            break;
                        case 'other':
                            page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                            page.color = "#ff6600";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                            break;
                            case 'hentai':
                                page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1255160148272353373/Rias.gif?ex=667c1e7b&is=667accfb&hm=cd9d086020fd0e062be92126942d1d683c15a878bb699b000d9db9a34447eb6c&";
                                page.color = "#ff99cc";
                                page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                                page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1230824519220985896/6280-2.gif?ex=667beaa8&is=667a9928&hm=50dfab0b5a63dab7abdc167899c447041b9717016c71e4ffe377a0d7a989d6b5&";
                                break;
                            case 'music':
                                page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                                page.color = "#ffcc00";
                                page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                                page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1255146656882622554/8693-youtube-music.png?ex=667c11ea&is=667ac06a&hm=b81b2b2d294019d1c647069c9fa4f4ed09d4d3403aa8fdae2555ff6c1c88e0a9&";
                                break;
                            case 'troll':
                                page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                                page.color = "#cc0000";
                                page.thumbnail = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191552998342687/All_in_one.png?ex=669cf9a1&is=669ba821&hm=eec8a5ec58467205c61757d7b4450785b31dc739e7351f3e5ce230d7eb6fb1d9&";
                                page.author.iconURL = "https://cdn.discordapp.com/attachments/1246408947708072027/1264191161212342282/GlaceYT_1.png?ex=669cf944&is=669ba7c4&hm=3170787ef8dfcde922996ce7bdbaf909c4a18b3e9d757cee8b020ddc70e12c84&";
                                break;
                            default:
                                break;
                        }
    
                        pages.push(page);
                    }
    
                    return pages;
                };
    
                const slashCommandPages = createSlashCommandPages();
                const prefixCommandPages = createPrefixCommandPages();
                let currentPage = 0;
                let isPrefixHelp = false;
    
                const createEmbed = () => {
                    const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                    const page = pages[currentPage];
                    const fieldName = page.title === "Bot Information" ? "Additional Information" : "Commands";
                    return new EmbedBuilder()
                        .setTitle(page.title)
                        .setDescription(page.description)
                        .setColor(page.color)
                        .setImage(page.image)
                        .setThumbnail(page.thumbnail)
                        .setAuthor({ name: page.author.name, iconURL: page.author.iconURL, url: page.author.url })
                        .addFields({ name: fieldName, value: page.commands.join(', ') });
                };
    
                const createActionRow = () => {
                    const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                    return new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous1')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId('next2')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === pages.length - 1),
                            new ButtonBuilder()
                                .setCustomId('prefix')
                                .setLabel(isPrefixHelp ? 'Slash Command List' : 'Prefix Command List')
                                .setStyle(ButtonStyle.Secondary)
                        );
                };
    
                const createDropdown = () => {
                    const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                    return new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('page-select')
                                .setPlaceholder('Select a page')
                                .addOptions(pages.map((page, index) => ({
                                    label: page.title,
                                    value: index.toString()
                                })))
                        );
                };
    
                await interaction.reply({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });
    
                const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });
    
                collector.on('collect', async (button) => {
                    if (button.user.id !== interaction.user.id) return;
    
                    if (button.isButton()) {
                        if (button.customId === 'previous1') {
                            currentPage = (currentPage - 1 + (isPrefixHelp ? prefixCommandPages : slashCommandPages).length) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                        } else if (button.customId === 'next2') {
                            currentPage = (currentPage + 1) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                        } else if (button.customId === 'prefix') {
                            isPrefixHelp = !isPrefixHelp;
                            currentPage = 0;
                        }
                    } else if (button.isSelectMenu()) {
                        currentPage = parseInt(button.values[0]);
                    }
    
                    try {
                        await button.update({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });
                    } catch (error) {
                        console.error('Error updating the interaction:', error);
                    }
                });
    
                collector.on('end', async () => {
                    try {
                        await interaction.editReply({ components: [] });
                    } catch (error) {
                        console.error('Error editing the interaction reply:', error);
                    }
                });
            },
    };
