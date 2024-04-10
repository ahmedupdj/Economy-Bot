const { Events,ActivityType } = require('discord.js');
const connectToDatabase = require ('../../Database/Connection')


module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);

        client.user.setPresence({ activities: [{ name: '/help', type: ActivityType.Playing }]});



    }
}
