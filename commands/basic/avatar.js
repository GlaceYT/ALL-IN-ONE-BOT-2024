const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(lang.avatarDescription)
        .addUserOption(option => 
            option.setName('user')
                .setDescription(lang.avatarUserOptionDescription)
                .setRequired(false)),
    async execute(interaction) {
        const createAvatarEmbed = (user) => {
            const avatarUrlPng = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
            const avatarUrlJpeg = user.displayAvatarURL({ format: 'jpeg', dynamic: true, size: 1024 });

            return new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(lang.avatarTitle.replace('{username}', user.username))
                .setImage(avatarUrlPng)
                .setDescription(`
                    **[${lang.downloadPng}](${avatarUrlPng})**
                    **[${lang.downloadJpeg}](${avatarUrlJpeg})**
                `)
                .setTimestamp();
        };

        if (interaction.isCommand && interaction.isCommand()) {
            const user = interaction.options.getUser('user') || interaction.user;
            const embed = createAvatarEmbed(user);
            await interaction.reply({ embeds: [embed] });
        } else {
            const args = interaction.content.split(' ').slice(1);
            let user;

            if (args.length > 0) {
                user = interaction.mentions.users.first() || interaction.client.users.cache.get(args[0]);
            }
            if (!user) {
                user = interaction.author;
            }

            const embed = createAvatarEmbed(user);
            await interaction.reply({ embeds: [embed] });
        }
    },
};
