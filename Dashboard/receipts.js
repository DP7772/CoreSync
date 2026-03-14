document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. DOM ELEMENTS SELECTION
    // ==========================================
    const btnNewReceipt = document.getElementById('btnNewReceipt');
    const btnListView = document.getElementById('btnListView');
    const btnKanbanView = document.getElementById('btnKanbanView');
    const viewList = document.getElementById('viewList');
    const viewKanban = document.getElementById('viewKanban');
    const viewDetail = document.getElementById('viewDetail');
    const emptyState = document.getElementById('emptyState');
    const receiptTableBody = document.getElementById('receiptTableBody');
    
    // Modals
    const receiptModal = document.getElementById('receiptModal');
    const closeModal = document.getElementById('closeModal');
    const cancelModal = document.getElementById('cancelModal');
    const receiptForm = document.getElementById('receiptForm');
    const refInput = document.getElementById('refId');
    const modalTitle = receiptModal.querySelector('.modal-header h3');
    const submitBtn = receiptForm.querySelector('button[type="submit"]');
    
    // Detail View Elements
    const btnCancelDetail = document.getElementById('btnCancelDetail');
    const btnValidate = document.getElementById('btnValidate');
    const btnPrint = document.getElementById('btnPrint');
    
    // Alert Modal
    const actionAlertModal = document.getElementById('actionAlertModal');
    const btnGotIt = document.getElementById('btnGotIt');
    const alertIcon = document.getElementById('alertIcon');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');

    // Profile & Logout Elements
    const profileAvatar = document.getElementById('profileAvatar');
    const profilePopup = document.getElementById('profilePopup');
    const logoutBtn = document.getElementById('logoutBtn');

    // State Variables
    let receiptCounter = 1; 
    let receiptsList = []; 
    let editIndex = -1; 
    let currentView = 'list'; 
    let draggedItemIndex = null; 
    let currentlyViewingReceiptIndex = null;

    const generateRefID = () => `WH/IN/${String(receiptCounter).padStart(3, '0')}`;

    // ==========================================
    // 3. NAVIGATION LOGIC
    // ==========================================
    const switchToListKanban = () => {
        viewDetail.classList.add('hidden');
        if (currentView === 'list') {
            viewList.classList.remove('hidden');
            viewKanban.classList.add('hidden');
        } else {
            viewKanban.classList.remove('hidden');
            viewList.classList.add('hidden');
        }
        renderData();
    };

    btnListView.addEventListener('click', () => {
        currentView = 'list';
        btnListView.classList.add('active');
        btnKanbanView.classList.remove('active');
        switchToListKanban();
    });

    btnKanbanView.addEventListener('click', () => {
        currentView = 'kanban';
        btnKanbanView.classList.add('active');
        btnListView.classList.remove('active');
        switchToListKanban();
    });

    btnCancelDetail.addEventListener('click', switchToListKanban);

    // ==========================================
    // 4. NEW/EDIT MODAL LOGIC
    // ==========================================
    btnNewReceipt.addEventListener('click', () => {
        editIndex = -1;
        modalTitle.innerText = "Create New Receipt";
        if(submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Receipt';
        receiptForm.reset(); 
        refInput.value = generateRefID(); 
        receiptModal.classList.add('active');
    });

    const closeAndResetModal = () => {
        receiptModal.classList.remove('active');
        setTimeout(() => { receiptForm.reset(); editIndex = -1; }, 300);
    };

    closeModal.addEventListener('click', closeAndResetModal);
    cancelModal.addEventListener('click', closeAndResetModal);

    receiptForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const formData = {
            ref: refInput.value,
            supplier: document.getElementById('supplierName').value,
            supplierRef: document.getElementById('supplierRef').value || "N/A",
            warehouse: document.getElementById('warehouse').value,
            date: document.getElementById('scheduleDate').value,
            status: document.getElementById('status').value
        };

        if (editIndex === -1) {
            receiptsList.push(formData);
            receiptCounter++; 
        } else {
            receiptsList[editIndex] = formData;
            if(currentlyViewingReceiptIndex === editIndex) openDetailView(editIndex);
        }
        renderData();
        closeAndResetModal();
    });

    const openEditModal = (index) => {
        editIndex = index;
        const data = receiptsList[index];
        modalTitle.innerText = "Edit Receipt";
        if(submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Update Receipt';
        
        refInput.value = data.ref;
        document.getElementById('supplierName').value = data.supplier;
        document.getElementById('supplierRef').value = data.supplierRef === "N/A" ? "" : data.supplierRef;
        document.getElementById('warehouse').value = data.warehouse;
        document.getElementById('scheduleDate').value = data.date;
        document.getElementById('status').value = data.status;
        receiptModal.classList.add('active');
    };

    // ==========================================
    // 5. DETAIL VIEW LOGIC
    // ==========================================
    const openDetailView = (index) => {
        currentlyViewingReceiptIndex = index;
        const data = receiptsList[index];
        
        document.getElementById('docRef').innerText = data.ref;
        document.getElementById('docDate').innerText = data.date;
        document.getElementById('docSupplier').innerText = data.supplier;
        document.getElementById('docBillNo').innerText = data.supplierRef;
        document.getElementById('docStatus').innerText = data.status;

        viewList.classList.add('hidden');
        viewKanban.classList.add('hidden');
        viewDetail.classList.remove('hidden');
    };

    // ==========================================
    // 6. ALERT MODAL LOGIC
    // ==========================================
    btnGotIt.addEventListener('click', () => actionAlertModal.classList.remove('active'));

    const showAlert = (type, title, message) => {
        alertTitle.innerText = title;
        alertMessage.innerText = message;
        if (type === 'error') {
            alertIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b;"></i>';
        } else {
            alertIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i>';
        }
        actionAlertModal.classList.add('active');
    };

    btnValidate.addEventListener('click', () => {
        const data = receiptsList[currentlyViewingReceiptIndex];
        if (data.status !== 'Done') {
            showAlert('error', 'Action Not Allowed', 'This order has not been received yet. You cannot validate this receipt until its status is marked as Done.');
        } else {
            showAlert('success', 'Validated Successfully', 'This receipt has been validated. You can now continue or print the document.');
        }
    });

    btnPrint.addEventListener('click', () => {
        const data = receiptsList[currentlyViewingReceiptIndex];
        if (data.status !== 'Done') {
            showAlert('error', 'Cannot Print Document', 'Please wait until the order is completely received (Status: Done) before generating the PDF voucher.');
        } else {
            window.print();
        }
    });

    // ==========================================
    // 7. RENDER FUNCTIONS
    // ==========================================
    const renderData = () => { currentView === 'list' ? renderTable() : renderKanban(); };

    const renderTable = () => {
        receiptTableBody.innerHTML = '';
        if (receiptsList.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            receiptsList.forEach((item, index) => {
                let badgeClass = item.status === 'Draft' ? 'badge-draft' : item.status === 'Ready' ? 'badge-ready' : 'badge-done';
                const tr = document.createElement('tr');
                tr.style.cursor = "pointer";
                tr.innerHTML = `
                    <td style="font-weight: 700; color: #60a5fa;">${item.ref}</td>
                    <td>${item.supplier}</td>
                    <td>${item.warehouse}</td>
                    <td>${item.date}</td>
                    <td><span class="badge ${badgeClass}">${item.status}</span></td>
                    <td style="display:flex; gap:1rem;">
                        <a class="action-link view-btn" data-index="${index}" style="color:#10b981; cursor:pointer;"><i class="fa-solid fa-eye"></i> View</a>
                        <a class="action-link edit-btn" data-index="${index}" style="cursor:pointer;"><i class="fa-solid fa-pen-to-square"></i> Edit</a>
                    </td>
                `;
                
                tr.addEventListener('dblclick', () => openDetailView(index));
                receiptTableBody.appendChild(tr);
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => { e.stopPropagation(); openEditModal(parseInt(e.currentTarget.getAttribute('data-index'))); });
            });
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => { e.stopPropagation(); openDetailView(parseInt(e.currentTarget.getAttribute('data-index'))); });
            });
        }
    };

    const renderKanban = () => {
        ['Draft', 'Ready', 'Done'].forEach(status => document.getElementById(`col${status}`).innerHTML = '');
        let counts = { Draft: 0, Ready: 0, Done: 0 };

        receiptsList.forEach((item, index) => {
            counts[item.status]++;
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.draggable = true; 
            
            card.innerHTML = `
                <div class="card-top">
                    <span class="card-ref">${item.ref}</span>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="card-edit-btn view-btn" data-index="${index}" style="color:#10b981;" title="View Document"><i class="fa-solid fa-eye"></i></button>
                        <button class="card-edit-btn edit-btn" data-index="${index}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    </div>
                </div>
                <h4 class="card-title">${item.supplier}</h4>
                <div class="card-warehouse"><i class="fa-solid fa-building"></i> ${item.warehouse}</div>
                <div class="card-bottom"><span><i class="fa-solid fa-calendar-day"></i> ${item.date}</span></div>
            `;

            card.addEventListener('dblclick', () => openDetailView(index));
            card.addEventListener('dragstart', () => { draggedItemIndex = index; setTimeout(() => card.style.opacity = '0.5', 0); });
            card.addEventListener('dragend', () => { card.style.opacity = '1'; draggedItemIndex = null; });

            document.getElementById(`col${item.status}`).appendChild(card);
        });

        document.getElementById('countDraft').innerText = counts.Draft;
        document.getElementById('countReady').innerText = counts.Ready;
        document.getElementById('countDone').innerText = counts.Done;

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); openEditModal(parseInt(e.currentTarget.getAttribute('data-index'))); });
        });
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); openDetailView(parseInt(e.currentTarget.getAttribute('data-index'))); });
        });
    };

    // ==========================================
    // 8. DRAG AND DROP
    // ==========================================
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            if (draggedItemIndex !== null) {
                receiptsList[draggedItemIndex].status = zone.parentElement.getAttribute('data-status');
                renderData();
            }
        });
    });

    // ==========================================
    // 9. PROFILE POPUP & LOGOUT LOGIC (Fixed Location)
    // ==========================================
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

    // Initialize the View
    renderData();
});