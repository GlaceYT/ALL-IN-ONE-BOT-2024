const { Client, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle  } = require('discord.js');
const { voiceChannelCollection, centralizedControlCollection } = require('../mongodb');

let config = {};

async function loadConfig() {
    try {
        const voiceChannels = await voiceChannelCollection.find({}).toArray();
        config.voiceChannelSetup = voiceChannels.reduce((acc, channel) => {
            acc[channel.serverId] = {
                voiceChannelId: channel.voiceChannelId,
                managerChannelId: channel.managerChannelId,
                status: channel.status
            };
            return acc;
        }, {});
    } catch (err) {
        //console.error('Error loading config from MongoDB:', err);
        config.voiceChannelSetup = {}; 
    }
}

setInterval(loadConfig, 5000);


setInterval(async () => {
    try {
        const now = Date.now();
        const outdatedChannels = await voiceChannelCollection.find({
            isTemporary: true,
            createdAt: { $lt: new Date(now -  6 * 60 * 60 * 1000) } 
        }).toArray();

        for (const channel of outdatedChannels) {
            const guild = client.guilds.cache.get(channel.guildId);
            if (!guild) continue;

            const channelObj = guild.channels.cache.get(channel.channelId);
            if (channelObj) {
                await channelObj.delete();
            }
            await voiceChannelCollection.deleteOne({ channelId: channel.channelId });
        }
    } catch (error) {
        //console.error('Error during cleanup:', error);
    }
}, 5000); 

const deleteChannelAfterTimeout = (client, channelId, timeout) => {
    setTimeout(async () => {
        try {
            const row = await voiceChannelCollection.findOne({ channelId });
            if (row) {
                const guild = client.guilds.cache.get(row.guildId);
                if (!guild) return;

                const channel = guild.channels.cache.get(channelId);
                if (channel) {
                    await channel.delete();
                    await voiceChannelCollection.deleteOne({ channelId });
                }
            }
        } catch (error) {
            //console.error('Error deleting channel:', error);
        }
    }, timeout);
};

const sendOrUpdateCentralizedEmbed = async (client, guild) => {
    const guildConfig = config.voiceChannelSetup[guild.id];
    if (!guildConfig) return;

    const managerChannelId = guildConfig.managerChannelId;
    const managerChannel = guild.channels.cache.get(managerChannelId);

    if (!managerChannel) {
        console.log(`Manager channel not found for guild: ${guild.id}`);
        return;
    }

    try {
        const existingControl = await centralizedControlCollection.findOne({ guildId: guild.id });
        const embed = new EmbedBuilder()
            .setAuthor({ 
            name: "Voice Channel Manager", 
            iconURL: "https://cdn.discordapp.com/emojis/1092879273712435262.gif" ,
             url: "https://discord.gg/"
            })
            .setDescription('- Click the buttons below to control your voice channel')
            .setColor('#00FF00')
            .addFields([
                {
                    name: 'Button Usage',
                    value: `
                        🔒 — Lock the voice channel  
                        🔓 — Unlock the voice channel  
                        👻 — Ghost the voice channel  
                        ✨ — Reveal the voice channel  
                        🚩 — Claim the voice channel  
                        🚫 — Disconnect a members  
                        🎮 — Start an activity  
                        ℹ️ — View channel information  
                        ➕ — Increase the user limit  
                        ➖ — Decrease the user limit
                    `
                }
                
            ])
            .setTimestamp();

            const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('voice_control_lock_channel').setEmoji('🔒').setStyle(ButtonStyle.Secondary), 
                new ButtonBuilder().setCustomId('voice_control_unlock_channel').setEmoji('🔓').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('voice_control_ghost_channel').setEmoji('👻').setStyle(ButtonStyle.Secondary), 
                new ButtonBuilder().setCustomId('voice_control_reveal_channel').setEmoji('✨').setStyle(ButtonStyle.Secondary), 
                new ButtonBuilder().setCustomId('voice_control_claim_channel').setEmoji('🚩').setStyle(ButtonStyle.Secondary) 
            );
        
        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('voice_control_disconnect_member').setEmoji('🚫').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('voice_control_start_activity').setEmoji('🎮').setStyle(ButtonStyle.Primary), 
                new ButtonBuilder().setCustomId('voice_control_view_channel_info').setEmoji('ℹ️').setStyle(ButtonStyle.Primary), 
                new ButtonBuilder().setCustomId('voice_control_increase_limit').setEmoji('➕').setStyle(ButtonStyle.Primary), 
                new ButtonBuilder().setCustomId('voice_control_decrease_limit').setEmoji('➖').setStyle(ButtonStyle.Primary) 
            );

        if (existingControl) {
            try {
                const message = await managerChannel.messages.fetch(existingControl.messageId);

             
                if (message.author.id === client.user.id) {
                   
                    await message.edit({ embeds: [embed], components: [row1, row2] });
                } else {
                   
                    await message.delete();
                    const newMessage = await managerChannel.send({ embeds: [embed], components: [row1, row2] });
                    await centralizedControlCollection.updateOne(
                        { guildId: guild.id },
                        { $set: { messageId: newMessage.id } }
                    );
                }
            } catch (fetchError) {
                if (fetchError.code === 10008) { 
                    console.error(`Message not found for guild ${guild.id}. Removing outdated record.`);
                    await centralizedControlCollection.deleteOne({ guildId: guild.id });
                    const newMessage = await managerChannel.send({ embeds: [embed], components: [row1, row2] });
                    await centralizedControlCollection.insertOne({
                        guildId: guild.id,
                        messageId: newMessage.id,
                    });
                } else {
                    console.error(`Error fetching message for guild ${guild.id}:`, fetchError);
                }
            }
        } else {
            const newMessage = await managerChannel.send({ embeds: [embed], components: [row1, row2] });
            await centralizedControlCollection.insertOne({
                guildId: guild.id,
                messageId: newMessage.id,
            });
        }
    } catch (error) {
        console.error(`Error handling centralized embed for guild: ${guild.id}`, error);
    }
};

const checkOutdatedCentralizedControls = async (client) => {
    try {
        const records = await centralizedControlCollection.find({}).toArray();
        for (const record of records) {
            const guild = client.guilds.cache.get(record.guildId);
            if (!guild) continue;

            const managerChannel = guild.channels.cache.get(guild.voiceChannelSetup?.managerChannelId);
            if (!managerChannel) {
                await centralizedControlCollection.deleteOne({ guildId: record.guildId });
                continue;
            }

            try {
                await managerChannel.messages.fetch(record.messageId);
            } catch (fetchError) {
                if (fetchError.code === 10008) {
                    console.error(`Message not found for guild ${record.guildId}. Removing outdated record.`);
                    await centralizedControlCollection.deleteOne({ guildId: record.guildId });
                    continue;
                } else {
                    console.error(`Error fetching message for guild ${record.guildId}:`, fetchError);
                }
            }
        }
    } catch (error) {
        console.error('Error checking outdated centralized controls:', error);
    }
};

const handleVoiceStateUpdate = async (client, oldState, newState) => {

    if (oldState.channelId && !newState.channelId) {
        const oldChannel = oldState.channel;

  
        const voiceChannel = await voiceChannelCollection.findOne({ channelId: oldChannel.id, isTemporary: true });

        if (voiceChannel) {
     
            if (oldChannel.members.size === 0) {
                try {
                  
                    await oldChannel.delete();
                    //console.log(`Deleted empty voice channel: ${oldChannel.name}`);

                    // Delete the channel record from the MongoDB collection
                    await voiceChannelCollection.deleteOne({ channelId: oldChannel.id });
                    //console.log(`Deleted voice channel record from database: ${oldChannel.id}`);
                } catch (error) {
                    //console.error(`Error deleting channel or record for channel ${oldChannel.id}:`, error);
                }
            }
        }
    }


    if (oldState.channelId === newState.channelId) return;

    const guildId = newState.guild.id;
    const settings = config.voiceChannelSetup[guildId];
    if (!settings || !settings.status) return;

    const { voiceChannelId } = settings;
    const member = newState.member;

    if (newState.channelId === voiceChannelId) {
        try {
            const newChannel = await newState.guild.channels.create({
                name: `${member.user.username}'s channel`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parentId,
                permissionOverwrites: [
                    {
                        id: member.user.id,
                        allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                    },
                    {
                        id: newState.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.Connect]
                    }
                ]
            });

         
            await member.voice.setChannel(newChannel);

           
            await voiceChannelCollection.insertOne({
                id: newChannel.id,
                guildId,
                channelId: newChannel.id,
                userId: member.user.id, 
                createdAt: new Date(),
                isTemporary: true
            });


            deleteChannelAfterTimeout(client, newChannel.id, 6 * 60 * 60 * 1000);
        } catch (error) {
            //console.error('Error creating voice channel:', error);
        }
    }
};


const handleButtonInteraction = async (interaction) => {

    if (!interaction.isButton()) return;

  
    const PREFIX = 'voice_control_';

 
    if (!interaction.customId.startsWith(PREFIX)) return;

    const guild = interaction.guild;
    const userId = interaction.user.id;
    const member = guild.members.cache.get(userId);
    const currentVoiceChannel = member?.voice.channel;

    if (!currentVoiceChannel) {
        return interaction.reply({ content: 'You must be in a voice channel to perform this action.', ephemeral: true });
    }

    const channelId = currentVoiceChannel.id;
    const voiceChannel = await voiceChannelCollection.findOne({ channelId });

    if (!voiceChannel) {
        return interaction.reply({ content: 'This channel is not managed by the bot.', ephemeral: true });
    }

    if (voiceChannel.userId !== userId) {
        return interaction.reply({ content: 'You do not have permission to manage this channel.', ephemeral: true });
    }

    try {
      
        const action = interaction.customId.replace(PREFIX, '');

        switch (action) {
            case 'lock_channel':
                await currentVoiceChannel.permissionOverwrites.set([
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.Connect],
                    },
                ]);
                await interaction.reply({ content: 'Your channel is now locked.', ephemeral: true });
                break;

            case 'unlock_channel':
                await currentVoiceChannel.permissionOverwrites.set([
                    {
                        id: guild.roles.everyone,
                        allow: [PermissionsBitField.Flags.Connect],
                    },
                ]);
                await interaction.reply({ content: 'Your channel is now unlocked.', ephemeral: true });
                break;

            case 'ghost_channel':
                await currentVoiceChannel.permissionOverwrites.set([
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                ]);
                await interaction.reply({ content: 'Your channel is now ghosted.', ephemeral: true });
                break;

            case 'reveal_channel':
                await currentVoiceChannel.permissionOverwrites.set([
                    {
                        id: guild.roles.everyone,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ]);
                await interaction.reply({ content: 'Your channel is now revealed.', ephemeral: true });
                break;

            case 'claim_channel':
                await interaction.reply({ content: 'You have claimed this channel.', ephemeral: true });
                break;

            case 'disconnect_member':
                if (currentVoiceChannel.members.size > 1) {
                    const randomMember = currentVoiceChannel.members.random();
                    await randomMember.voice.disconnect();
                    await interaction.reply({ content: `${randomMember.user.tag} has been disconnected.`, ephemeral: true });
                } else {
                    await interaction.reply({ content: 'No other members to disconnect.', ephemeral: true });
                }
                break;

            case 'start_activity':
                await interaction.reply({ content: 'Starting an activity is currently not supported.', ephemeral: true });
                break;

            case 'view_channel_info':
                const info = `Channel Name: ${currentVoiceChannel.name}\nChannel ID: ${currentVoiceChannel.id}`;
                await interaction.reply({ content: info, ephemeral: true });
                break;

            case 'increase_limit':
                if (currentVoiceChannel.userLimit < 99) {
                    await currentVoiceChannel.setUserLimit(currentVoiceChannel.userLimit + 1);
                    await interaction.reply({ content: 'User limit increased.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Maximum user limit reached.', ephemeral: true });
                }
                break;

            case 'decrease_limit':
                if (currentVoiceChannel.userLimit > 0) {
                    await currentVoiceChannel.setUserLimit(currentVoiceChannel.userLimit - 1);
                    await interaction.reply({ content: 'User limit decreased.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Minimum user limit reached.', ephemeral: true });
                }
                break;

            default:
                await interaction.reply({ content: 'Invalid button pressed.', ephemeral: true });
        }
    } catch (error) {
        console.error('Error handling button interaction:', error);
        await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
    }
};



module.exports = (client) => {
    client.on('ready', async () => {
        try {
            await loadConfig();
            client.guilds.cache.forEach(guild => sendOrUpdateCentralizedEmbed(client, guild));
        } catch (error) {
            console.error('Error during ready event:', error);
        }
    });

    client.on('voiceStateUpdate', (oldState, newState) => handleVoiceStateUpdate(client, oldState, newState));

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
        } else {
            //await handleInteraction(interaction);
        }
    });
};

module.exports.loadConfig = loadConfig;
module.exports.sendOrUpdateCentralizedEmbed = sendOrUpdateCentralizedEmbed;
