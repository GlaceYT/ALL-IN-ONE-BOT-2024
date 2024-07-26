const config = require('../config.json');

module.exports = (client) => {
    client.on('guildMemberAdd', async member => {
        const guildId = member.guild.id;
        const settings = config.autorole[guildId];

        console.log(`New member added: ${member.user.tag} in guild: ${member.guild.name}`);
        console.log(`Fetched settings for guild ${guildId}:`, settings);

        // Check if settings exist and status is explicitly true
        if (settings && settings.status === true) {
            const role = member.guild.roles.cache.get(settings.roleId);

            if (role) {
                console.log(`Assigning role ${role.name} to user ${member.user.tag}`);
                member.roles.add(role)
                    .then(() => console.log(`Assigned role ${role.name} to user ${member.user.tag}`))
                    .catch(err => console.log(`Failed to assign role: ${err}`));
            } else {
                console.log(`Role not found for guild: ${member.guild.name}`);
            }
        } else {
            console.log(`Autorole is disabled or not properly configured for guild: ${member.guild.name}`);
        }
    });
};
