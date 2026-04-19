const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Jab koi /api/auth/register par aayega, to registerUser function chalega
router.post('/register', registerUser);

// Jab koi /api/auth/login par aayega, to loginUser function chalega
router.post('/login', loginUser);

module.exports = router;