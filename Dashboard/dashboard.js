document.addEventListener('DOMContentLoaded', () => {
    const profileAvatar = document.getElementById('profileAvatar');
    const profilePopup = document.getElementById('profilePopup');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle Profile Popup on Avatar Click
    profileAvatar.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents click from instantly closing it
        profilePopup.classList.toggle('active');
    });

    // Close Popup if clicked anywhere else on the screen
    document.addEventListener('click', (e) => {
        if (!profilePopup.contains(e.target) && e.target !== profileAvatar) {
            profilePopup.classList.remove('active');
        }
    });

    // --- LOGOUT LOGIC ---
    logoutBtn.addEventListener('click', () => {
        // Step 1: Save a secret note in browser memory that we just logged out
        sessionStorage.setItem('justLoggedOut', 'true');
        
        // Step 2: Redirect to Landing Page (Change path if your folder structure differs)
        window.location.href = "../Landing page/index.html"; 
    });
});