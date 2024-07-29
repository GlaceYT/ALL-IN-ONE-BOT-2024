const antisetup = require('../antisetup.json');

const antiRaid = (client) => {
    const joinMap = new Map();
    console.log('\x1b[36m[ SECUTIRY ]\x1b[0m', '\x1b[32mAnti - Raid System Active ✅\x1b[0m');
    client.on('guildMemberAdd', (member) => {
        const guild = member.guild;
        const settings = antisetup[guild.id]?.antiRaid;
        if (!settings?.enabled) return;

        const currentTime = Date.now();
        const newMembers = joinMap.get(guild.id) || [];

        newMembers.push({ id: member.id, joinedAt: currentTime });
        joinMap.set(guild.id, newMembers);

        const recentJoins = newMembers.filter(m => currentTime - m.joinedAt < settings.timeWindow);

        const logChannel = guild.channels.cache.get(antisetup[guild.id].logChannelId);

        if (recentJoins.length > settings.joinLimit) {
            recentJoins.forEach(async (m) => {
                const raidMember = guild.members.cache.get(m.id);
                if (raidMember) {
                    await raidMember[settings.action]('Anti-raid: Rapid joining');
                    logChannel?.send(`User ${raidMember.user.tag} kicked/banned for rapid joining.`);
                }
            });

            guild.owner.send('A raid attempt was detected and prevented.');
        }
    });
};

module.exports = antiRaid;
