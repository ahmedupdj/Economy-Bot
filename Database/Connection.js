const { connect, set } = require('mongoose');
const config = require('../config')

async function connectToDatabase() {
    try {
        await connect(config.bot.mongourl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(async (connection) => {
            await console.log(`🟢Work ${connection.connections[0].name}`);
        });
    } catch (error) {
        console.log('🔴 Error');
        console.error(error);
    }
}



module.exports = connectToDatabase;