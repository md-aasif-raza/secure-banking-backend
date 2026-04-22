document.addEventListener("DOMContentLoaded", () => {
    console.log("SecureBank Core Initialized.");

    // ==========================================
    // 1. INITIALIZE 3D CHARTS (Chart.js)
    // ==========================================
    try {
        const ctxBar = document.getElementById('cashFlowChart').getContext('2d');
        const ctxDonut = document.getElementById('activityChart').getContext('2d');

        let gradientBar = ctxBar.createLinearGradient(0, 0, 0, 400);
        gradientBar.addColorStop(0, '#4318FF');
        gradientBar.addColorStop(1, 'rgba(67, 24, 255, 0.2)');

        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Transfers',
                    data: [1200, 1900, 800, 2500, 1500, 3200, 1000],
                    backgroundColor: gradientBar,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false, grid: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });

        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: ['Deposits', 'Transfers', 'Withdrawals'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#4318FF', '#05cd99', '#FFCE20'],
                    borderWidth: 0, cutout: '75%'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    } catch (e) {
        console.log("Chart loading delayed or canvas missing.");
    }

    // ==========================================
    // 2. CORE LOGIC (Queue, LIFO Stack, OTP)
    // ==========================================
    const sendBtn = document.getElementById("sendBtn");
    const otpModal = document.getElementById("otpModal");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const cancelOtpBtn = document.getElementById("cancelOtpBtn");
    const transferMessage = document.getElementById("transferMessage");
    const transactionList = document.getElementById("transactionList");
    const logoutBtn = document.getElementById("logoutBtn");
    
    let balance = 15000;

    // --- Transfer Button Logic ---
    sendBtn.addEventListener("click", () => {
        const email = document.getElementById("receiverEmail").value;
        const amt = parseInt(document.getElementById("transferAmount").value);
        
        // Error Handling (Visual Feedback)
        if(!email) {
            transferMessage.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Enter receiver's email!";
            transferMessage.style.color = "#ef4444";
            return;
        }
        if(!amt || amt <= 0) {
            transferMessage.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Enter a valid amount!";
            transferMessage.style.color = "#ef4444";
            return;
        }
        if(amt > balance) {
            transferMessage.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Insufficient Balance!";
            transferMessage.style.color = "#ef4444";
            return;
        }

        // If all good, show OTP
        transferMessage.innerHTML = "";
        otpModal.style.display = "flex";
        document.getElementById("otpInput").value = "";
    });

    // --- OTP Cancel ---
    cancelOtpBtn.addEventListener("click", () => {
        otpModal.style.display = "none";
    });

    // --- OTP Verify & Process (Queue Simulation) ---
    verifyOtpBtn.addEventListener("click", () => {
        const otpVal = document.getElementById("otpInput").value;
        if(otpVal.length < 6) {
            alert("Security Alert: Enter full 6-digit OTP.");
            return;
        }

        const amt = parseInt(document.getElementById("transferAmount").value);
        const email = document.getElementById("receiverEmail").value;
        
        verifyOtpBtn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Processing Queue...";
        verifyOtpBtn.style.background = "#f59e0b"; // Orange processing state
        
        // Fake 1.5s delay to show backend processing
        setTimeout(() => {
            balance -= amt;
            document.getElementById("balanceAmount").innerText = "₹" + balance.toLocaleString();
            
            // Add to Stack (LIFO - Top of list)
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="t-info">
                    <h4>Transfer to</h4>
                    <p>${email}</p>
                </div>
                <div class="t-amount negative">- ₹${amt.toLocaleString()}</div>
            `;
            transactionList.insertBefore(li, transactionList.firstChild);

            // Reset UI
            otpModal.style.display = "none";
            verifyOtpBtn.innerText = "Verify Transaction";
            verifyOtpBtn.style.background = "#4318FF";
            document.getElementById("receiverEmail").value = "";
            document.getElementById("transferAmount").value = "";
            
            transferMessage.innerHTML = "<i class='fa-solid fa-circle-check'></i> Secure Transfer Complete!";
            transferMessage.style.color = "#05cd99";
        }, 1500);
    });

    // --- Logout Button ---
    logoutBtn.addEventListener("click", () => {
        let confirmExit = confirm("Initiate secure system exit?");
        if(confirmExit) {
            document.body.innerHTML = `
                <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #0b1437; color: #05cd99;">
                    <i class="fa-solid fa-shield-check" style="font-size: 60px; margin-bottom: 20px;"></i>
                    <h1>Session Terminated Successfully</h1>
                    <p style="color: #a3aed1; margin-top: 10px;">Security tokens destroyed.</p>
                </div>`;
        }
    });

    // --- Sidebar Links Feedback ---
    const navItems = document.querySelectorAll(".nav-links li");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove active class from all, add to clicked
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
            
            // Show alert if it's not the Overview tab
            if(item.innerText !== " Overview") {
                alert(`Routing to ${item.innerText.trim()} module... (Connecting to backend)`);
            }
        });
    });

    // --- Initial Stack Data ---
    transactionList.innerHTML = `
        <li><div class="t-info"><h4>Initial Deposit</h4><p>Main Branch</p></div><div class="t-amount positive">+ ₹15,000</div></li>
    `;
});