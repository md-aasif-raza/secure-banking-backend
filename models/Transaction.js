const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: function() { return this.type === 'transfer' || this.type === 'withdraw'; }
    },
    receiverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: function() { return this.type === 'transfer' || this.type === 'deposit'; }
    },
    amount: { 
        type: Number, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['transfer', 'deposit', 'withdraw'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'completed' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);