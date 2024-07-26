const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');
const qr = require('qrcode');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('generateqr')
        .setDescription('Generates a QR code for the provided text')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to encode into QR code')
                .setRequired(true)),

    async execute(interaction) {
        try {
            let textToEncode;

            // Check if it's a slash command interaction
            if (interaction.isCommand && interaction.isCommand()) {
                textToEncode = interaction.options.getString('text');
            } else {
                // It's a prefix command interaction
                const args = interaction.content.split(' ');
                args.shift(); // Remove the command name
                textToEncode = args.join(' ');
            }

            // Generate QR code as a buffer
            const qrCodeBuffer = await qr.toBuffer(textToEncode, { width: 500, height: 500 });

            // Create a MessageAttachment from the buffer
            const attachment = new AttachmentBuilder(qrCodeBuffer, { name : 'qrcode.png'});

            // Reply with the attachment
            await interaction.reply({ files: [attachment] });
        } catch (error) {
            console.error('Error generating QR code:', error);
            await interaction.reply('Failed to generate QR code. Please try again.');
        }
    },
};


