// Assuming you already have this event listener in your bot:
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    // Add your dcwhitelist command handler here
    if (commandName === 'dcwhitelist') {
        const user = options.getUser('target');

        const embed = {
            color: 0x00FF00,  // Green color for success
            title: 'WHITELIST RESULT',
            description: `Congratulations, ${user}! You are Whitelisted!`,
            fields: [
                {
                    name: 'Next Steps',
                    value: `Make sure to check #SERVER-IP for the server IP and put your in-game name here.`
                },
                {
                    name: 'Enjoy Roleplay',
                    value: 'Have fun!'
                }
            ],
            footer: {
                text: `Whitelisted BY: ${interaction.user.tag}`
            },
            timestamp: new Date()
        };

        await interaction.reply({ embeds: [embed] });
    }
});
