const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    lastClaim: {
        type: Date,
        default: null,
    },
    

});
module.exports = mongoose.model('Balance', balanceSchema);
