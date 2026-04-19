const express = require('express');
const router = express.Router();
const { transferFunds, getTransactionHistory, sortTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// In sabme authMiddleware laga hai (Layer 2 Security)
router.post('/transfer', authMiddleware, transferFunds); // Queue use hoga
router.get('/history', authMiddleware, getTransactionHistory); // Stack use hoga
router.get('/sort', authMiddleware, sortTransactions); // Quick Sort use hoga

module.exports = router;