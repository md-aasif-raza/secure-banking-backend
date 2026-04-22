document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const depositBtn = document.querySelector(".deposit");
    const withdrawBtn = document.querySelector(".withdraw");
    const sendBtn = document.getElementById("sendBtn");
    const otpModal = document.getElementById("otpModal");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const cancelOtpBtn = document.getElementById("cancelOtpBtn");
    const otpInput = document.getElementById("otpInput");
    const balanceAmount = document.getElementById("balanceAmount");
    const transferMessage = document.getElementById("transferMessage");
    const transactionList = document.getElementById("transactionList");

    // Variables to hold state during OTP verification
    let currentAction = ""; 
    let currentAmount = 0;
    let balance = 15000; // Starting Dummy Balance

    // Initialize Balance
    updateBalance();

    function updateBalance() {
        balanceAmount.innerText = "₹" + balance.toLocaleString();
    }

    // --- OTP MODAL LOGIC ---
    function showOTP(action, amount) {
        currentAction = action;
        currentAmount = parseInt(amount);
        otpModal.style.display = "flex"; // Show Modal
        otpInput.value = "";
        transferMessage.innerText = "";
    }

    cancelOtpBtn.addEventListener("click", () => {
        otpModal.style.display = "none";
    });

    // --- BUTTON CLICKS ---
    depositBtn.addEventListener("click", () => {
        let amt = prompt("Enter amount to deposit (₹):");
        if(amt && !isNaN(amt) && amt > 0) showOTP("deposit", amt);
    });

    withdrawBtn.addEventListener("click", () => {
        let amt = prompt("Enter amount to withdraw (₹):");
        if(amt && !isNaN(amt) && amt > 0) {
            if(amt > balance) alert("Insufficient Balance!");
            else showOTP("withdraw", amt);
        }
    });

    sendBtn.addEventListener("click", () => {
        const email = document.getElementById("receiverEmail").value;
        const amt = parseInt(document.getElementById("transferAmount").value);
        
        if(!email || !amt || amt <= 0) {
            transferMessage.innerText = "Please enter valid email and amount.";
            transferMessage.style.color = "#ef4444";
            return;
        }
        if(amt > balance) {
            transferMessage.innerText = "Insufficient balance for transfer!";
            transferMessage.style.color = "#ef4444";
            return;
        }
        showOTP("transfer", amt);
    });

    // --- CORE LOGIC (QUEUE & STACK SIMULATION) ---
    verifyOtpBtn.addEventListener("click", () => {
        if(otpInput.value.length !== 6) {
            alert("Security Alert: Please enter a valid 6-digit OTP.");
            return;
        }

        // Simulate QUEUE Processing (DSA Concept)
        verifyOtpBtn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Processing Queue...";
        verifyOtpBtn.style.background = "#f59e0b"; // Orange Warning color

        // Artificial delay to show system processing
        setTimeout(() => {
            // Deduct or Add Balance
            if(currentAction === "deposit") balance += currentAmount;
            else balance -= currentAmount; // For withdraw and transfer

            updateBalance();
            addTransactionToStack(currentAction, currentAmount);

            // Reset UI
            otpModal.style.display = "none";
            verifyOtpBtn.innerText = "Verify & Proceed";
            verifyOtpBtn.style.background = "#10b981";

            if(currentAction === "transfer") {
                transferMessage.innerHTML = "<i class='fa-solid fa-check-circle'></i> Transfer successful!";
                transferMessage.style.color = "#10b981";
                document.getElementById("receiverEmail").value = "";
                document.getElementById("transferAmount").value = "";
            }

        }, 1800); // 1.8 seconds delay
    });

    // --- STACK LOGIC (LIFO) ---
    function addTransactionToStack(type, amt) {
        const row = document.createElement("tr");
        const date = new Date().toLocaleString();
        let email = (type === "transfer") ? document.getElementById("receiverEmail").value : "Self (Account)";

        let typeHtml = "";
        if(type === "deposit") typeHtml = "<span style='color:#10b981; font-weight:bold;'>Deposit</span>";
        if(type === "withdraw") typeHtml = "<span style='color:#ef4444; font-weight:bold;'>Withdraw</span>";
        if(type === "transfer") typeHtml = "<span style='color:#3b82f6; font-weight:bold;'>Transfer</span>";

        row.innerHTML = `
            <td>${typeHtml}</td>
            <td>${email}</td>
            <td style="font-family:monospace; font-size:16px;">₹${amt.toLocaleString()}</td>
            <td style="color:#94a3b8; font-size:12px;">${date}</td>
        `;

        // LIFO: Insert at the top of the table
        transactionList.insertBefore(row, transactionList.firstChild);
    }

    // --- LOGOUT ---
    document.getElementById("logoutBtn").addEventListener("click", () => {
        let confirmLogout = confirm("Are you sure you want to securely logout?");
        if(confirmLogout) {
            document.body.innerHTML = "<h1 style='color:#10b981; text-align:center; margin-top:20vh;'>Logged out securely. Session destroyed.</h1>";
        }
    });
});