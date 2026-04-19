const Transaction = require('../models/Transaction');
const User = require('../models/User');

// ==========================================
// 1. FUND TRANSFER (DSA: QUEUE - FIFO)
// ==========================================
// Ek array ko hum Queue ki tarah use karenge
const transactionQueue = [];

exports.transferFunds = async (req, res) => {
    try {
        const { receiverEmail, amount } = req.body;
        const senderId = req.user.id; // Ye hum JWT se nikalenge (next step me)

        // Dono users ko dhundho
        const sender = await User.findById(senderId);
        const receiver = await User.findOne({ email: receiverEmail });

        if (!receiver) return res.status(404).json({ message: "Receiver account not found." });
        if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance." });

        // Naya transaction create karo
        const newTransaction = new Transaction({
            senderId: sender._id,
            receiverId: receiver._id,
            amount,
            type: 'transfer',
            status: 'pending' // Shuru me pending rahega
        });

        // 🔥 DSA: Queue me push karo (FIFO pattern ke liye)
        transactionQueue.push(newTransaction);

        // 🔥 DSA: Queue se process karo (Jo pehle aaya, wo pehle jayega)
        const processingTx = transactionQueue.shift(); 

        // Balance update karo
        sender.balance -= amount;
        receiver.balance += amount;
        
        await sender.save();
        await receiver.save();

        // Transaction complete mark karke DB me save kardo
        processingTx.status = 'completed';
        await processingTx.save();

        res.status(200).json({ message: `Success! ₹${amount} transfer ho gaye.`, transaction: processingTx });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// 2. TRANSACTION HISTORY (DSA: STACK - LIFO)
// ==========================================
exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Database se saari transactions nikaalo jisme user sender ya receiver hai
        const transactions = await Transaction.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        });

        // 🔥 DSA: Stack Implement karna (Last In First Out)
        // Taaki sabse latest transaction sabse upar dikhe
        let stack = [];
        let history = [];

        // Step 1: Saare data ko stack me daalo (Push)
        transactions.forEach(tx => stack.push(tx));

        // Step 2: Stack se nikaalo (Pop) - Isse list automatically reverse ho jayegi!
        while(stack.length > 0) {
            history.push(stack.pop());
        }

        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// 3. SORT TRANSACTIONS (DSA: QUICK SORT)
// ==========================================
exports.sortTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        });

        // 🔥 DSA: Custom Quick Sort Function (Amount ke hisab se sort karne ke liye)
        const quickSort = (arr) => {
            if (arr.length <= 1) return arr;
            
            let pivot = arr[arr.length - 1]; // Last element ko pivot maante hain
            let left = [];
            let right = [];
            
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i].amount < pivot.amount) left.push(arr[i]); // Chote amount left me
                else right.push(arr[i]); // Bade amount right me
            }
            
            // Recursion lagakar merge kar do
            return [...quickSort(left), pivot, ...quickSort(right)];
        };

        const sortedTransactions = quickSort(transactions);
        res.status(200).json({ sortedTransactions });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};