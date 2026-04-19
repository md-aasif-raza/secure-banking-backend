const User = require('../models/User');
const Transaction = require('../models/Transaction');

// 1. Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Block or Unblock a User
exports.toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found." });
        
        user.isBlocked = !user.isBlocked;
        await user.save();
        
        res.status(200).json({ 
            message: `User account has been ${user.isBlocked ? 'Blocked' : 'Unblocked'} successfully.` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get All Transactions for Monitoring
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('senderId', 'name email')
            .populate('receiverId', 'name email');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};