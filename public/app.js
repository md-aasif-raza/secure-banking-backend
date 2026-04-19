// Form Toggle Logic
function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// 1. Register Logic
async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Account created successfully! Please proceed to login.");
        toggleForm();
    } else {
        alert("Error: " + data.message);
    }
}

// 2. Login Logic
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Login Successful!");
        
        // Token aur User detail local storage me save kar rahe hain
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showDashboard();
    } else {
        alert("Login Failed: " + data.message);
    }
}

// 3. Show Dashboard Logic
function showDashboard() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';

    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userBalance').innerText = '₹' + user.balance;
}

// 4. Logout Logic
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}

// ==========================================
// 5. Fund Transfer Logic (Queue API)
// ==========================================
async function transferFunds() {
    const receiverEmail = document.getElementById('transferEmail').value;
    const amount = document.getElementById('transferAmount').value;
    const token = localStorage.getItem('token'); 

    const response = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify({ receiverEmail, amount: Number(amount) })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        // Balance update karne ke liye local storage update kar rahe hain
        let user = JSON.parse(localStorage.getItem('user'));
        user.balance -= Number(amount);
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('userBalance').innerText = '₹' + user.balance;
        
        // Form clear karna
        document.getElementById('transferEmail').value = '';
        document.getElementById('transferAmount').value = '';
        loadHistory(); // Naya transaction hone pe history refresh karo
    } else {
        alert("Transfer Failed: " + data.message);
    }
}

// ==========================================
// 6. Transaction History Logic (Stack API)
// ==========================================
async function loadHistory() {
    const token = localStorage.getItem('token');
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = "Loading...";

    const response = await fetch('/api/transactions/history', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    const data = await response.json();
    if (response.ok) {
        historyList.innerHTML = '';
        if (data.history.length === 0) {
            historyList.innerHTML = "<p style='color: #94a3b8;'>No recent transactions found.</p>";
            return;
        }

        // Stack se aayi hui latest history ko list me dikhana
        data.history.forEach(tx => {
            const txType = tx.type.toUpperCase();
            const color = txType === 'TRANSFER' ? '#ef4444' : '#10b981'; 
            
            historyList.innerHTML += `
                <div style="border-bottom: 1px solid #334155; padding: 8px 0; display: flex; justify-content: space-between;">
                    <span>${txType}</span>
                    <strong style="color: ${color};">₹${tx.amount}</strong>
                </div>
            `;
        });
    } else {
        historyList.innerHTML = "<p style='color: red;'>Error loading history.</p>";
    }
}

// Page load hone par check karo agar user pehle se login hai
window.onload = () => {
    if (localStorage.getItem('token')) {
        showDashboard();
    }
};