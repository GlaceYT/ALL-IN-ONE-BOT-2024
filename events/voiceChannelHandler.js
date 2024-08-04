const { Client, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const db = require('../database/voicedb');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');
let config = {};

function loadConfig() {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(data);
  } catch (err) {
    console.error('Error reading or parsing config file:', err);
  }
}

loadConfig();
setInterval(loadConfig, 5000);

const deleteChannelAfterTimeout = (client, channelId, timeout) => {
  setTimeout(async () => {
    try {
      const row = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM voice_channels WHERE channelId = ?', [channelId], (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row);
        });
      });

      if (row) {
        const guild = client.guilds.cache.get(row.guildId);
        const channel = guild.channels.cache.get(channelId);
        if (channel) {
          await channel.delete();
          db.run('DELETE FROM voice_channels WHERE channelId = ?', [channelId], (err) => {
            if (err) {
              console.error(err);
            }
          });
          const settings = config.voiceChannelSetup[guild.id];
          const managerChannel = guild.channels.cache.get(settings.managerChannelId);
          if (managerChannel) {
            managerChannel.send(`Voice channel ${channel.name} has been deleted after 6 hours.`);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting channel:', error);
    }
  }, timeout);
};

module.exports = (client) => {
  client.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.channelId === newState.channelId) return;

    const guildId = newState.guild.id;
    const settings = config.voiceChannelSetup[guildId];
    if (!settings || !settings.status) return;

    const { mainVoiceChannelId, managerChannelId } = settings;
    const member = newState.member;

    if (newState.channelId === mainVoiceChannelId) {
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
        db.run('INSERT INTO voice_channels (id, guildId, channelId, userId, createdAt, isTemporary) VALUES (?, ?, ?, ?, datetime("now"), 1)', [newChannel.id, guildId, newChannel.id, member.user.id]);

        const managerChannel = newState.guild.channels.cache.get(managerChannelId);
        if (managerChannel) {
          const embed = new EmbedBuilder()
            .setAuthor({ 
              name: "Voice Channel Created", 
              iconURL: "https://cdn.discordapp.com/attachments/1230824451990622299/1252165467842416680/1667-yellow-gears.gif?ex=669e0c77&is=669cbaf7&hm=22e9b0a33b94f2162c7ca81a10cf0ca43206101568581e6fd8d090dcff6e4fe3&" ,
              url: "https://discord.gg/xfsuyAXV"
            })
            .setDescription(`A new voice channel has been created by ${member.user.tag}.`)
            .setFooter({ text: 'ALL IN ONE', iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=669d88ff&is=669c377f&hm=34e4630cd54a9b4fa7d93532443e315093c755a17b9a116a2c94ff0c003aca98&' })
            .addFields(
              { name: 'Channel', value: newChannel.name, inline: true },
              { name: 'Created By', value: `<@${member.user.id}>`, inline: true },
              { name: 'Options', value: 'Use the menu below to manage the channel.', inline: false }
            )
            .setTimestamp()
            .setColor('#00FF00');

          const row = new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('voice_channel_select')
                .setPlaceholder('Select a channel to manage')
                .addOptions([
                  {
                    label: newChannel.name,
                    value: newChannel.id
                  }
                ])
            );

          const message = await managerChannel.send({ content: `<@${member.user.id}>`, embeds: [embed], components: [row] });

          db.run('INSERT INTO voice_channel_messages (messageId, channelId, userId) VALUES (?, ?, ?)', [message.id, newChannel.id, member.user.id]);

          deleteChannelAfterTimeout(client, newChannel.id, 6 * 60 * 60 * 1000);
        }
      } catch (error) {
        console.error('Error creating voice channel:', error);
      }
    }
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    try {
      if (interaction.customId === 'voice_channel_select') {
        const channelId = interaction.values[0];

        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) return interaction.reply({ content: 'Channel not found. Please contact staff!', ephemeral: true });

        const member = interaction.guild.members.cache.get(interaction.user.id);
        const row = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM voice_channel_messages WHERE messageId = ? AND userId = ?', [interaction.message.id, interaction.user.id], (err, row) => {
            if (err) {
              return reject(err);
            }
            resolve(row);
          });
        });

        if (!row || row.userId !== interaction.user.id) {
          return interaction.reply({ content: 'You do not have permission to manage this channel. Please contact staff!', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setTitle('Manage Voice Channel')
          .setDescription(`Managing voice channel **${channel.name}**.`)
          .setColor('#00FF00')
          .addFields(
            { name: 'Options', value: 'Use the menu below to manage the channel.', inline: false }
          );

        const rowOptions = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('voice_channel_options')
              .setPlaceholder('Select an option')
              .addOptions([
                { label: 'Make Public', value: 'make_public' },
                { label: 'Make Private', value: 'make_private' },
                { label: 'Delete Channel', value: 'delete_channel' },
                { label: 'Don\'t Delete on Leave', value: 'dont_delete_on_leave' },
                { label: 'Edit Channel Name', value: 'edit_channel_name' }
              ])
          );

        await interaction.update({ embeds: [embed], components: [rowOptions] });
      }

      if (interaction.customId === 'voice_channel_options') {
        const { values } = interaction;
        const value = values[0];

        const row = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM voice_channel_messages WHERE messageId = ?', [interaction.message.id], (err, row) => {
            if (err) {
              return reject(err);
            }
            resolve(row);
          });
        });

        if (!row) return interaction.reply({ content: 'Channel not found in the database. Please contact staff!', ephemeral: true });

        const channel = interaction.guild.channels.cache.get(row.channelId);
        if (!channel) return interaction.reply({ content: 'Channel not found.', ephemeral: true });

        const member = interaction.guild.members.cache.get(interaction.user.id);
        const hasPermission = member.roles.cache.has(config.voiceChannelSetup[interaction.guild.id].adminRoleId) || interaction.user.id === row.userId;

        if (!hasPermission) {
          return interaction.reply({ content: 'You do not have permission to manage this channel. Please contact staff!', ephemeral: true });
        }

        switch (value) {
          case 'make_public':
            channel.permissionOverwrites.set([
              {
                id: interaction.guild.roles.everyone,
                allow: [PermissionsBitField.Flags.Connect]
              }
            ]);
            await interaction.reply({ content: 'Channel is now public.', ephemeral: true });
            break;

          case 'make_private':
            channel.permissionOverwrites.set([
              {
                id: interaction.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.Connect]
              }
            ]);
            await interaction.reply({ content: 'Channel is now private.', ephemeral: true });
            break;

          case 'delete_channel':
            await channel.delete();
            db.run('DELETE FROM voice_channels WHERE channelId = ?', [row.channelId]);
            db.run('DELETE FROM voice_channel_messages WHERE messageId = ?', [interaction.message.id]);
            await interaction.reply({ content: 'Channel deleted.', ephemeral: true });
            break;

          case 'dont_delete_on_leave':
            db.run('UPDATE voice_channels SET isTemporary = 0 WHERE channelId = ?', [row.channelId]);
            await interaction.reply({ content: 'Channel will not be deleted when the creator leaves.', ephemeral: true });
            break;

          case 'edit_channel_name':
            await interaction.reply({ content: 'Please provide the new name for the channel:', ephemeral: true });
            const filter = response => response.author.id === interaction.user.id;
            const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).catch(() => null);
            if (collected) {
              const newName = collected.first().content;
              await channel.setName(newName);
              await interaction.followUp({ content: `Channel name changed to ${newName}.`, ephemeral: true });
            } else {
              await interaction.followUp({ content: 'You took too long to respond.', ephemeral: true });
            }
            break;

          default:
            await interaction.reply({ content: 'Invalid option selected.', ephemeral: true });
        }
      }
    } catch (error) {
      if (error.code !== 10062) { 
        //console.error('Error handling interaction:', error);
      }
    }
  });
};
