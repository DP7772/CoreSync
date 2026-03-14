document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnNewLocation = document.getElementById('btnNewLocation');
    const locationModal = document.getElementById('locationModal');
    const closeModal = document.getElementById('closeModal');
    const cancelModal = document.getElementById('cancelModal');
    const locationForm = document.getElementById('locationForm');
    const locationTableBody = document.getElementById('locationTableBody');
    const emptyState = document.getElementById('emptyState');
    const modalTitle = locationModal.querySelector('.modal-header h3');

    // Profile Elements
    const profileAvatar = document.getElementById('profileAvatar');
    const profilePopup = document.getElementById('profilePopup');
    const logoutBtn = document.getElementById('logoutBtn');

    // Input Elements
    const parentWarehouseSelect = document.getElementById('parentWarehouse');
    const locCodeInput = document.getElementById('locCode');

    // State Variables
    let locationList = [];
    let editIndex = -1;

    // --- PROFILE & LOGOUT LOGIC ---
    if (profileAvatar && profilePopup) {
        profileAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            profilePopup.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!profilePopup.contains(e.target) && e.target !== profileAvatar) {
                profilePopup.classList.remove('active');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.setItem('justLoggedOut', 'true');
            window.location.href = "../Landing page/index.html"; 
        });
    }

    // --- SMART FEATURE: Auto-suggest Location Code based on Warehouse ---
    parentWarehouseSelect.addEventListener('change', () => {
        // Only auto-fill if the user hasn't typed anything yet, or if it's a new entry
        if (editIndex === -1) {
            const whCode = parentWarehouseSelect.value;
            locCodeInput.value = whCode + "-"; // Example: 'WH-CEN-'
            locCodeInput.focus(); // Shift cursor to code input so they can type the rest
        }
    });

    // --- MODAL LOGIC (Open / Close) ---
    btnNewLocation.addEventListener('click', () => {
        editIndex = -1;
        modalTitle.innerText = "Add New Location";
        locationForm.reset();
        locationModal.classList.add('active');
    });

    const closeAndResetModal = () => {
        locationModal.classList.remove('active');
        setTimeout(() => { locationForm.reset(); editIndex = -1; }, 300);
    };

    closeModal.addEventListener('click', closeAndResetModal);
    cancelModal.addEventListener('click', closeAndResetModal);

    // --- FORM SUBMIT LOGIC ---
    locationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get the visible text of the selected warehouse (not just the value code)
        const whSelect = document.getElementById('parentWarehouse');
        const whNameText = whSelect.options[whSelect.selectedIndex].text;

        const formData = {
            warehouse: whNameText,
            position: document.getElementById('locName').value,
            code: document.getElementById('locCode').value.toUpperCase()
        };

        if (editIndex === -1) {
            locationList.push(formData); 
        } else {
            locationList[editIndex] = formData; 
        }

        renderTable();
        closeAndResetModal();
    });

    // --- EDIT LOGIC ---
    const openEditModal = (index) => {
        editIndex = index;
        const data = locationList[index];
        modalTitle.innerText = "Edit Location";
        
        // Try to match the selected dropdown by value (extracting code from text)
        // Since we stored the full text "Central Godown (WH-CEN)", we need to find its match
        for (let i = 0; i < parentWarehouseSelect.options.length; i++) {
            if (data.warehouse === parentWarehouseSelect.options[i].text) {
                parentWarehouseSelect.selectedIndex = i;
                break;
            }
        }

        document.getElementById('locName').value = data.position;
        document.getElementById('locCode').value = data.code;
        
        locationModal.classList.add('active');
    };

    // --- DOUBLE CLICK PREPARATION ---
    const handleDoubleClick = (index) => {
        const data = locationList[index];
        console.log("Location Double Clicked! Data: ", data);
        alert(`Location Details:\nCode: ${data.code}\nWarehouse: ${data.warehouse}\nPosition: ${data.position}`);
    };

    // --- RENDER TABLE ---
    const renderTable = () => {
        locationTableBody.innerHTML = '';
        
        if (locationList.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');

            locationList.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="code-highlight" style="color: #3b82f6; background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2);">${item.code}</span></td>
                    <td style="color: #94a3b8;">${item.warehouse}</td>
                    <td style="font-weight: 700; color: #f8fafc;">${item.position}</td>
                    <td>
                        <button class="action-link edit-btn" data-index="${index}" style="background:none; border:none;">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                    </td>
                `;

                tr.addEventListener('dblclick', () => handleDoubleClick(index));

                locationTableBody.appendChild(tr);
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditModal(parseInt(e.currentTarget.getAttribute('data-index')));
                });
            });
        }
    };

    renderTable();
});