const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. USER REGISTRATION (DSA: HASHING)
// ==========================================
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check karte hain ki user pehle se to nahi hai
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email is already registered." });

        // 🔥 LAYER 1 SECURITY: Password Hashing (DSA Concept)
        // Plain text password ko secure hash me convert kar rahe hain
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Naya user create kar rahe hain
        const newUser = new User({
            name,
            email,
            password: hashedPassword // Hash kiya hua password save hoga
        });

        await newUser.save();
        res.status(201).json({ message: "Account created successfully!", userId: newUser._id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// 2. USER LOGIN (LAYER 2: JWT TOKENS)
// ==========================================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User ko database me search karna (MongoDB internally B-Tree use karta hai jo Binary Search jaisa fast hota hai)
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found. Please check your email." });

        // Admin Security Check
        if (user.isBlocked) return res.status(403).json({ message: "Account is blocked by the administrator." });

        // Password verify karna (Input password ko Hash se compare karna)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials. Incorrect password." });

        // 🔥 LAYER 2 SECURITY: JWT Token Generation
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || "aasif_secure_key_123", // Ise hum baad me .env me dalenge
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: "Login successful!", 
            token, 
            user: { name: user.name, balance: user.balance, role: user.role } 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};