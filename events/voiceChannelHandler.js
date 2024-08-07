const { Client, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { voiceChannelCollection, centralizedControlCollection } = require('../mongodb');

let config = {};

// Function to load configuration from MongoDB
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
            createdAt: { $lt: new Date(now - 6 * 60 * 60 * 1000) } 
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
            .setTitle('Voice Channel Management')
            .setDescription('Use the menu below to manage your voice channel.')
            .setColor('#00FF00')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('voice_channel_control') 
                    .setPlaceholder('Select an action')
                    .addOptions([
                        { label: 'Make Public', value: 'make_public' },
                        { label: 'Make Private', value: 'make_private' },
                        { label: 'Delete Channel', value: 'delete_channel' },
                        { label: 'Don\'t Delete on Leave', value: 'dont_delete_on_leave' },
                        { label: 'Edit Channel Name', value: 'edit_channel_name' }
                    ])
            );

        if (existingControl) {
            try {
                const message = await managerChannel.messages.fetch(existingControl.messageId);
                await message.edit({ embeds: [embed], components: [row] });
            } catch (fetchError) {
                if (fetchError.code === 10008) { 
                    console.error(`Message not found for guild ${guild.id}. Removing outdated record.`);
                    await centralizedControlCollection.deleteOne({ guildId: guild.id });
                    const newMessage = await managerChannel.send({ embeds: [embed], components: [row] });
                    await centralizedControlCollection.insertOne({
                        guildId: guild.id,
                        messageId: newMessage.id,
                    });
                } else {
                    //console.error(`Error fetching message for guild ${guild.id}:`, fetchError);
                }
            }
        } else {
            const newMessage = await managerChannel.send({ embeds: [embed], components: [row] });
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
                if (fetchError.code === 10008) { // Message not found
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
                userId: member.user.id, // Store the creator's user ID
                createdAt: new Date(),
                isTemporary: true
            });

            deleteChannelAfterTimeout(client, newChannel.id, 6 * 60 * 60 * 1000);
        } catch (error) {
            console.error('Error creating voice channel:', error);
        }
    }
};

const handleInteraction = async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  try {
      const userId = interaction.user.id;
      const guild = interaction.guild;

      if (!guild) {
          return interaction.reply({ content: 'Guild not found.', ephemeral: true });
      }

      // Ensure that the interaction is related to voice channel management
      if (interaction.customId !== 'voice_channel_control') {
          // Not a voice channel control interaction, so ignore it
          return;
      }

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

      // Check if the user is the owner or authorized
      if (voiceChannel.userId !== userId) {
          return interaction.reply({ content: 'You do not have permission to manage this channel.', ephemeral: true });
      }

      switch (interaction.values[0]) {
          case 'make_public':
              await currentVoiceChannel.permissionOverwrites.set([
                  {
                      id: guild.roles.everyone,
                      allow: [PermissionsBitField.Flags.Connect]
                  }
              ]);
              await interaction.reply({ content: 'Your channel is now public.', ephemeral: true });
              break;

          case 'make_private':
              await currentVoiceChannel.permissionOverwrites.set([
                  {
                      id: guild.roles.everyone,
                      deny: [PermissionsBitField.Flags.Connect]
                  }
              ]);
              await interaction.reply({ content: 'Your channel is now private.', ephemeral: true });
              break;

          case 'delete_channel':
              await currentVoiceChannel.delete();
              await voiceChannelCollection.deleteOne({ channelId: currentVoiceChannel.id });
              await interaction.reply({ content: 'Your channel has been deleted.', ephemeral: true });
              break;

          case 'dont_delete_on_leave':
              await voiceChannelCollection.updateOne({ channelId: currentVoiceChannel.id }, { $set: { isTemporary: false } });
              await interaction.reply({ content: 'Your channel will not be deleted when you leave.', ephemeral: true });
              break;

          case 'edit_channel_name':
              await interaction.reply({ content: 'Please provide the new name for your channel:', ephemeral: true });

              const filter = response => response.author.id === userId;
              const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).catch(() => null);

              if (collected) {
                  const newName = collected.first().content;
                  await currentVoiceChannel.setName(newName);

                  // Delete the user's message
                  await collected.first().delete();

                  await interaction.followUp({ content: `Your channel name has been changed to ${newName}.`, ephemeral: true });
              } else {
                  await interaction.followUp({ content: 'You took too long to respond.', ephemeral: true });
              }
              break;

          default:
              await interaction.reply({ content: 'Invalid option selected.', ephemeral: true });
      }
  } catch (error) {
      console.error('Error handling interaction:', error);
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

    client.on('interactionCreate', handleInteraction);
};

module.exports.loadConfig = loadConfig;
module.exports.sendOrUpdateCentralizedEmbed = sendOrUpdateCentralizedEmbed;
