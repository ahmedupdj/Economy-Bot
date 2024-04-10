const mongoose = require('mongoose');

const serverSettingsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    language: {
        type: String,
        default: 'en' 
    },

    AutoRole: {
        user: {
            type: String,
            default: null
        },
        bot: {
            type: String,
            default: null
        }
    }
});

module.exports = mongoose.model('ServerSettings', serverSettingsSchema);
