const express = require('express');
const router = express.Router();
const { getAllUsers, toggleBlockUser, getAllTransactions } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin Check Middleware (Sirf admin ko access dega)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access Denied. Administrator privileges required." });
    }
};

router.get('/users', authMiddleware, isAdmin, getAllUsers);
router.put('/users/block/:id', authMiddleware, isAdmin, toggleBlockUser);
router.get('/transactions', authMiddleware, isAdmin, getAllTransactions);

module.exports = router;