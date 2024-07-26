module.exports = {
    name: 'say',
    description: 'Deletes your message and says something.',
    async execute(message, args) {
        // Check if there is any text to say
        if (!args.length) {
            return message.reply('You need to provide some text to say!');
        }

        // Delete the user's command message
        try {
            await message.delete();
        } catch (error) {
            console.error('Error deleting message:', error);
            return message.reply('There was an error deleting your message.');
        }

        // Join the arguments into a single string
        const text = args.join(' ');

        // Send the new message
        message.channel.send(text);
    },
};
