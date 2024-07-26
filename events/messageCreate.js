
const { prefix } = require('../config.json');
const shiva = require('../shiva'); 
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000') // Red color for error
                .setTitle('Command Error')
                .setDescription(`An error occurred while executing the \`${commandName}\` command.`)
                .addFields( { name : 'Error Details:', value: error.message } );

            message.reply({ embeds: [errorEmbed] }); 
        }
    },
};
