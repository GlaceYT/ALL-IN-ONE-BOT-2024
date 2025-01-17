const { autoroleCollection } = require('../mongodb');

module.exports = (client) => {
    client.on('guildMemberAdd', async member => {
        const guildId = member.guild.id;
        const settings = await autoroleCollection.findOne({ serverId: guildId });

        if (settings && settings.status === true) {
            const role = member.guild.roles.cache.get(settings.roleId);

            if (role) {
                try {
                    await member.roles.add(role);
                } catch (err) {
                    //console.error(`Failed to assign role to user ${member.user.tag}:`, err);
                }
            } else {
                //console.error(`Role not found for guild ${member.guild.name}`);
            }
        } else {
            //console.error(`Autorole is disabled or not properly configured for guild ${member.guild.name}`);
        }
    });
};
