// Database/models/transfer.js

const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;
