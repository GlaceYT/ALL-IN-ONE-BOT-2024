module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
          
            if (error.code === 10062) {
                return;
            }

           
            if (error.message.includes('Interaction has already been acknowledged') ||
                error.message.includes('Unknown Message')) {
                console.warn('Interaction already replied or deferred error suppressed');
                return;
            }

      
            console.error(error);

            try {
              
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            } catch (replyError) {
        
                if (replyError.message.includes('Interaction has already been acknowledged') ||
                    replyError.message.includes('Unknown interaction')) {
                    return;
                }

                console.error('Error when sending error reply:', replyError);
            }
        }
    },
};
