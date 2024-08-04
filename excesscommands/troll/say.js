module.exports = {
    name: 'say',
    description: 'Deletes your message and says something.',
    async execute(message, args) {
      
        if (!args.length) {
            return message.reply('You need to provide some text to say!');
        }

    
        try {
            await message.delete();
        } catch (error) {
            console.error('Error deleting message:', error);
            return message.reply('There was an error deleting your message.');
        }

   
        const text = args.join(' ');

     
        message.channel.send(text);
    },
};
