document.addEventListener("DOMContentLoaded", () => {
    const authBtn = document.getElementById("authBtn");
    const toggleAuth = document.getElementById("toggleAuth");
    const registerFields = document.getElementById("registerFields");
    const authTitle = document.getElementById("authTitle");
    const errorBox = document.getElementById("errorBox");
    
    let isLogin = true;

    // Toggle between Login and Register
    toggleAuth.addEventListener("click", () => {
        isLogin = !isLogin;
        if(isLogin) {
            authTitle.innerText = "NetBanking Login";
            registerFields.style.display = "none";
            authBtn.innerText = "Secure Login";
            toggleAuth.innerHTML = "New to SecureBank? <span>Create Account</span>";
        } else {
            authTitle.innerText = "Open New Account";
            registerFields.style.display = "block";
            authBtn.innerText = "Register Now";
            toggleAuth.innerHTML = "Already have an account? <span>Login Here</span>";
        }
        errorBox.style.display = "none";
    });

    // Send Data to Backend
    authBtn.addEventListener("click", async () => {
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passInput").value;
        const name = document.getElementById("nameInput").value;

        if(!email || !password || (!isLogin && !name)) {
            showError("Please fill all required fields.");
            return;
        }

        authBtn.innerText = "Processing...";

        try {
            // Note: Assuming your backend routes are '/api/auth/login' and '/api/auth/register'
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const bodyData = isLogin ? { email, password } : { name, email, password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const data = await response.json();

            if(response.ok) {
                if(isLogin) {
                    // Save JWT Token to local storage (THIS IS THE KEY!)
                    localStorage.setItem("bankToken", data.token);
                    // Redirect to Dashboard
                    window.location.href = "index.html";
                } else {
                    alert("Account created successfully! Please login.");
                    toggleAuth.click(); // Switch back to login view
                }
            } else {
                showError(data.message || "Authentication failed. Check credentials.");
            }
        } catch (err) {
            showError("Server error. Ensure backend is running.");
        } finally {
            authBtn.innerText = isLogin ? "Secure Login" : "Register Now";
        }
    });

    function showError(msg) {
        errorBox.innerText = msg;
        errorBox.style.display = "block";
    }
});