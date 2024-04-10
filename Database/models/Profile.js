
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    biography: {
        type: String,
        default: 'Title'
    },
});
module.exports = mongoose.model('Profile', profileSchema);
