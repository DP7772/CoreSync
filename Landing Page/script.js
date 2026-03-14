document.addEventListener('DOMContentLoaded', () => {
    // Starting Data
    let totalStock = 12450;
    let pendingReceipts = 4;
    let dispatchedOrders = 28;

    // DOM Elements
    const totalStockEl = document.getElementById('totalStock');
    const pendingReceiptsEl = document.getElementById('pendingReceipts');
    const dispatchedOrdersEl = document.getElementById('dispatchedOrders');
    const liveLogEl = document.getElementById('live-log');

    // Number formatter (12450 -> 12,450)
    const formatNum = (num) => num.toLocaleString('en-US');

    // Helper: Update Log visually
    const updateLog = (message, iconClass, colorClass) => {
        liveLogEl.innerHTML = `<i class="${iconClass} ${colorClass}"></i> ${message}`;
        liveLogEl.classList.add('log-highlight');
        setTimeout(() => liveLogEl.classList.remove('log-highlight'), 500);
    };

    // Helper: Animate Number Change
    const animateValue = (element, animationClass) => {
        element.classList.add(animationClass);
        setTimeout(() => element.classList.remove(animationClass), 300);
    };

    // ACTION 1: Receive Stock (Adds stock, reduces trucks)
    document.getElementById('btn-receive').addEventListener('click', () => {
        if (pendingReceipts > 0) {
            totalStock += 50;
            pendingReceipts -= 1;
            
            totalStockEl.innerText = formatNum(totalStock);
            pendingReceiptsEl.innerText = pendingReceipts + (pendingReceipts === 1 ? " Truck" : " Trucks");
            
            animateValue(totalStockEl, 'value-update-up');
            updateLog("Received 50 units from Supplier.", "fa-solid fa-arrow-down", "text-green");
        } else {
            updateLog("All pending trucks received!", "fa-solid fa-check-double", "text-green");
        }
    });

    // ACTION 2: Dispatch Order (Reduces stock, adds to dispatched)
    document.getElementById('btn-dispatch').addEventListener('click', () => {
        if (totalStock >= 10) {
            totalStock -= 10;
            dispatchedOrders += 1;
            
            totalStockEl.innerText = formatNum(totalStock);
            dispatchedOrdersEl.innerText = dispatchedOrders + " Orders";
            
            animateValue(totalStockEl, 'value-update-down');
            updateLog("Packed & Dispatched 10 units to Customer.", "fa-solid fa-truck-fast", "text-blue");
        }
    });

    // ACTION 3: Internal Transfer (Stock stays same, location changes)
    document.getElementById('btn-transfer').addEventListener('click', () => {
        // Stock doesn't change overall, just moves!
        animateValue(totalStockEl, 'value-update-up'); // Just a visual bump
        
        // Randomize locations for a cool effect
        const locations = ["Main Godown", "Retail Shop", "Rack A4", "Store Room", "Loading Dock"];
        const from = locations[Math.floor(Math.random() * locations.length)];
        let to = locations[Math.floor(Math.random() * locations.length)];
        while (from === to) to = locations[Math.floor(Math.random() * locations.length)]; // Ensure different

        updateLog(`Moved 25 units: ${from} ➔ ${to}`, "fa-solid fa-right-left", "text-yellow");
    });
});

// ==========================================
    // AUTH MODAL & TOAST LOGIC
    // ==========================================
    
    const authModal = document.getElementById('authModal');
    const closeAuth = document.getElementById('closeAuth');
    const authTriggers = document.querySelectorAll('.auth-trigger');
    
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const toggleBg = document.getElementById('toggleBg');
    const authSlider = document.getElementById('authSlider');
    const authTitle = document.getElementById('authTitle');
    const signupForm = document.getElementById('signupForm');
    const toastNotification = document.getElementById('toastNotification');

    // Open Modal when CTA buttons are clicked
    authTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.add('active');
            // Reset to Login tab by default when opening
            switchToLogin(); 
        });
    });

    // Close Modal
    closeAuth.addEventListener('click', () => {
        authModal.classList.remove('active');
    });

    // Close Modal if clicked outside the box
    authModal.addEventListener('click', (e) => {
        if(e.target === authModal) {
            authModal.classList.remove('active');
        }
    });

    // Logic for smooth Tab Switching (Swipe effect)
    const switchToLogin = () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        toggleBg.style.transform = 'translateX(0)';
        authSlider.style.transform = 'translateX(0)';
        authTitle.innerText = "Welcome Back";
    };

    const switchToSignup = () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        toggleBg.style.transform = 'translateX(100%)'; // Moves the pill background
        authSlider.style.transform = 'translateX(-50%)'; // Slides the forms
        authTitle.innerText = "Create Account";
    };

    tabLogin.addEventListener('click', switchToLogin);
    tabSignup.addEventListener('click', switchToSignup);

    // Show iPhone-style Toast on Sign Up
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents actual page reload
        
        // Hide Modal
        authModal.classList.remove('active');
        
        // Show Toast Notification
        setTimeout(() => {
            toastNotification.classList.add('show');
            
            // Auto hide toast after 4 seconds
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 4000);
            
        }, 300); // Small delay to let modal close first
        
        // Reset form
        signupForm.reset();
    });

    // Hardcoded Login Bypass logic in script.js
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop normal submission
            
            // Redirect to our new awesome dashboard!
            window.location.href = "../dashboard/dashboard.html";
        });
    }

    // ==========================================
    // CHECK FOR LOGOUT REDIRECT NOTIFICATION
    // ==========================================
    if (sessionStorage.getItem('justLoggedOut') === 'true') {
        const toastNotification = document.getElementById('toastNotification');
        
        // Change the text of the existing Toast to a Logout Message
        toastNotification.querySelector('h4').innerText = "Logged Out";
        toastNotification.querySelector('p').innerText = "Your session has ended securely.";
        toastNotification.querySelector('i').className = "fa-solid fa-lock text-blue"; // Change icon to a lock
        
        // Show Toast
        setTimeout(() => {
            toastNotification.classList.add('show');
            
            // Auto hide after 4 seconds
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 4000);
        }, 500); // Small delay so page loads completely first
        
        // Clear the memory so it doesn't show again on normal refresh
        sessionStorage.removeItem('justLoggedOut');
    }