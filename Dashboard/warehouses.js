document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnNewWarehouse = document.getElementById('btnNewWarehouse');
    const warehouseModal = document.getElementById('warehouseModal');
    const closeModal = document.getElementById('closeModal');
    const cancelModal = document.getElementById('cancelModal');
    const warehouseForm = document.getElementById('warehouseForm');
    const warehouseTableBody = document.getElementById('warehouseTableBody');
    const emptyState = document.getElementById('emptyState');
    const modalTitle = warehouseModal.querySelector('.modal-header h3');

    // Profile Elements
    const profileAvatar = document.getElementById('profileAvatar');
    const profilePopup = document.getElementById('profilePopup');
    const logoutBtn = document.getElementById('logoutBtn');

    // State Variables
    let warehouseList = [];
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

    // --- MODAL LOGIC (Open / Close) ---
    btnNewWarehouse.addEventListener('click', () => {
        editIndex = -1;
        modalTitle.innerText = "Add New Warehouse";
        warehouseForm.reset();
        warehouseModal.classList.add('active');
    });

    const closeAndResetModal = () => {
        warehouseModal.classList.remove('active');
        setTimeout(() => { warehouseForm.reset(); editIndex = -1; }, 300);
    };

    closeModal.addEventListener('click', closeAndResetModal);
    cancelModal.addEventListener('click', closeAndResetModal);

    // --- FORM SUBMIT LOGIC ---
    warehouseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            code: document.getElementById('whCode').value.toUpperCase(),
            name: document.getElementById('whName').value,
            address: document.getElementById('whAddress').value
        };

        if (editIndex === -1) {
            warehouseList.push(formData); // New Warehouse
        } else {
            warehouseList[editIndex] = formData; // Edit Existing
        }

        renderTable();
        closeAndResetModal();
    });

    // --- EDIT LOGIC ---
    const openEditModal = (index) => {
        editIndex = index;
        const data = warehouseList[index];
        modalTitle.innerText = "Edit Warehouse";
        
        document.getElementById('whCode').value = data.code;
        document.getElementById('whName').value = data.name;
        document.getElementById('whAddress').value = data.address;
        
        warehouseModal.classList.add('active');
    };

    // --- DOUBLE CLICK PREPARATION ---
    // Jab aap bataoge data kahan se aayega, tab is function mein design connect karenge
    const handleDoubleClick = (index) => {
        const data = warehouseList[index];
        console.log("Row Double Clicked! Data: ", data);
        alert(`You double-clicked on: ${data.name} (${data.code})\nAap bataiye next isme kya dikhana hai?`);
    };

    // --- RENDER TABLE ---
    const renderTable = () => {
        warehouseTableBody.innerHTML = '';
        
        if (warehouseList.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');

            warehouseList.forEach((item, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="code-highlight">${item.code}</span></td>
                    <td style="font-weight: 700; color: #f8fafc;">${item.name}</td>
                    <td style="color: #94a3b8; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.address}</td>
                    <td>
                        <button class="action-link edit-btn" data-index="${index}" style="background:none; border:none;">
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>
                    </td>
                `;

                // Double Click Event Listener
                tr.addEventListener('dblclick', () => handleDoubleClick(index));

                warehouseTableBody.appendChild(tr);
            });

            // Re-attach edit button listeners
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditModal(parseInt(e.currentTarget.getAttribute('data-index')));
                });
            });
        }
    };

    // Initial Load
    renderTable();
});