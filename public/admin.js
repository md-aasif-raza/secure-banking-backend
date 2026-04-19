let allTransactions = []; // Pura data yahan save hoga sort karne ke liye

// Page Load Security Check
window.onload = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || user.role !== 'admin') {
        alert("Access Denied. You are not an Administrator.");
        window.location.href = 'index.html'; // Normal user ko wapas bhej do
    } else {
        loadUsers();
        loadTransactions();
    }
};

// ==========================================
// 1. Load All Users & Block System
// ==========================================
async function loadUsers() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.ok) {
        const users = await response.json();
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        users.forEach(u => {
            const btnClass = u.isBlocked ? 'unblock-btn' : 'block-btn';
            const btnText = u.isBlocked ? 'Unblock' : 'Block';
            
            usersList.innerHTML += `
                <div class="item-row">
                    <div>
                        <strong>${u.name}</strong><br>
                        <span style="color: #94a3b8; font-size: 12px;">Balance: ₹${u.balance}</span>
                    </div>
                    <button class="${btnClass}" onclick="toggleBlock('${u._id}')">${btnText}</button>
                </div>
            `;
        });
    }
}

async function toggleBlock(userId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/admin/users/block/${userId}`, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.ok) {
        const data = await response.json();
        alert(data.message);
        loadUsers(); // List ko refresh karo
    }
}

// ==========================================
// 2. Load Transactions
// ==========================================
async function loadTransactions() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/admin/transactions', {
        headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.ok) {
        allTransactions = await response.json();
        renderTransactions(allTransactions);
    }
}

function renderTransactions(transactions) {
    const txList = document.getElementById('transactionsList');
    txList.innerHTML = '';

    if (transactions.length === 0) {
        txList.innerHTML = "<p style='color: #94a3b8; text-align: center;'>No transactions found.</p>";
        return;
    }

    transactions.forEach(tx => {
        const typeStr = tx.type.toUpperCase();
        const color = typeStr === 'TRANSFER' ? '#38bdf8' : '#10b981';
        
        txList.innerHTML += `
            <div class="item-row">
                <div>
                    <strong style="color: ${color};">${typeStr}</strong><br>
                    <span style="color: #94a3b8; font-size: 12px;">₹${tx.amount}</span>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 12px;">Status: ${tx.status}</span>
                </div>
            </div>
        `;
    });
}

// ==========================================
// 3. DSA: Quick Sort Implementation
// ==========================================
function sortTransactions() {
    if (allTransactions.length === 0) return;

    // Quick Sort Logic
    const quickSort = (arr) => {
        if (arr.length <= 1) return arr;
        
        let pivot = arr[arr.length - 1]; // Last element as pivot
        let left = [];
        let right = [];
        
        for (let i = 0; i < arr.length - 1; i++) {
            // Sort in Descending order (Highest amount first)
            if (arr[i].amount > pivot.amount) left.push(arr[i]);
            else right.push(arr[i]);
        }
        
        return [...quickSort(left), pivot, ...quickSort(right)];
    };

    allTransactions = quickSort(allTransactions);
    renderTransactions(allTransactions);
    alert("Transactions sorted by highest amount using Quick Sort algorithm.");
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}