const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // JSON data read karne ke liye
app.use(cors()); // Frontend ko backend se connect karne ke liye
app.use(express.static('public')); // Frontend files serve karne ke liye

// MongoDB Database Connection
// Apni .env file me MONGO_URI=teri_mongodb_link dalna mat bhulna
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/secure_banking";

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Database Connected Successfully!'))
    .catch((err) => console.log('❌ Database Connection Error:', err));

// Basic Route Checking
// Basic Route Checking
app.get('/api/status', (req, res) => {
    res.json({ message: "Secure Banking Server is Running!" });
});

// Routes Import Kar Rahe Hain
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// API Endpoints Setup
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});