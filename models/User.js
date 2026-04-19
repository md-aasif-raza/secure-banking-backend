const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }, // Ise hum next step me Hashing (bcrypt) se secure karenge
    balance: { 
        type: Number, 
        default: 5000 
    }, // Naye user ko start me 5000 ka balance dete hain testing ke liye
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }, // Layer 4 Security: Role Access Control
    isBlocked: { 
        type: Boolean, 
        default: false 
    } // Admin feature ke liye accounts block karne ka system
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);