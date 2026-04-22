document.addEventListener("DOMContentLoaded", () => {
    // --- INITIALIZE CHARTS (Making it look real) ---
    const ctxBar = document.getElementById('cashFlowChart').getContext('2d');
    const ctxDonut = document.getElementById('activityChart').getContext('2d');

    // Premium Bar Chart with Gradients
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
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false, grid: { display: false } },
                x: { grid: { display: false }, border: { display: false } }
            }
        }
    });

    // Premium Donut Chart
    new Chart(ctxDonut, {
        type: 'doughnut',
        data: {
            labels: ['Deposits', 'Transfers', 'Withdrawals'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: ['#4318FF', '#05cd99', '#FFCE20'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });

    // --- CORE LOGIC (OTP & Transactions) ---
    const sendBtn = document.getElementById("sendBtn");
    const otpModal = document.getElementById("otpModal");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const cancelOtpBtn = document.getElementById("cancelOtpBtn");
    const transferMessage = document.getElementById("transferMessage");
    const transactionList = document.getElementById("transactionList");
    let balance = 15000;

    sendBtn.addEventListener("click", () => {
        const email = document.getElementById("receiverEmail").value;
        const amt = parseInt(document.getElementById("transferAmount").value);
        if(!email || !amt || amt <= 0) return;
        otpModal.style.display = "flex";
        document.getElementById("otpInput").value = "";
    });

    cancelOtpBtn.addEventListener("click", () => {
        otpModal.style.display = "none";
    });

    verifyOtpBtn.addEventListener("click", () => {
        const amt = parseInt(document.getElementById("transferAmount").value);
        verifyOtpBtn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Processing...";
        
        setTimeout(() => {
            balance -= amt;
            document.getElementById("balanceAmount").innerText = "₹" + balance.toLocaleString();
            
            // Add to UI List (LIFO Queue style)
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="t-info">
                    <h4>Transfer to</h4>
                    <p>${document.getElementById("receiverEmail").value}</p>
                </div>
                <div class="t-amount negative">- ₹${amt.toLocaleString()}</div>
            `;
            transactionList.insertBefore(li, transactionList.firstChild);

            // Reset
            otpModal.style.display = "none";
            verifyOtpBtn.innerText = "Verify Transaction";
            document.getElementById("receiverEmail").value = "";
            document.getElementById("transferAmount").value = "";
        }, 1500);
    });

    // Initial Dummy Data for List
    transactionList.innerHTML = `
        <li><div class="t-info"><h4>Deposit</h4><p>System</p></div><div class="t-amount positive">+ ₹5,000</div></li>
        <li><div class="t-info"><h4>Transfer</h4><p>alex@bank.com</p></div><div class="t-amount negative">- ₹1,200</div></li>
    `;
});