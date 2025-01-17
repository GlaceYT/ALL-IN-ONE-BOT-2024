const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription(lang.purgeCommandDescription)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription(lang.purgeAmountDescription)
                .setRequired(true)),
    
    async execute(interaction) {
        try {
            let amount;

          
            if (interaction.isCommand && interaction.isCommand()) {
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(lang.purgeNoPermission);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                amount = interaction.options.getInteger('amount');

                if (amount < 1 || amount > 100) {
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setDescription(lang.purgeInvalidAmount);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            } else {
              
                const args = interaction.content.split(' ');
                amount = parseInt(args[1]);

                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                    return interaction.reply(lang.purgeNoPermission);
                }

                if (isNaN(amount) || amount < 1 || amount > 100) {
                    return interaction.reply(lang.purgeInvalidAmount);
                }
            }

          
            const messages = await interaction.channel.bulkDelete(amount, true);
            
            
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(lang.purgeSuccess.replace('${messages.size}', messages.size));
            
          
            if (interaction.isCommand && interaction.isCommand()) {
                return interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
              
                return;
            }
        } catch (error) {
        
            let errorMessage = lang.purgeFailed;

          
            if (error.code === 50013) {
                errorMessage = lang.purgeNoDeletePermission;
            } else if (error.code === 50034) {
                errorMessage = lang.purgeMessagesOld;
            } else if (error.code === 50035) {
                errorMessage = lang.purgeUnknownMessageRef;
            }

            return interaction.reply({ content: errorMessage, ephemeral: true });
        }
    },
};
