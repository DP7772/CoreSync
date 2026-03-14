# 📦 CoreSync OS - Modern Inventory & ERP System

CoreSync OS is a modern, fast, and interactive web-based Inventory and ERP (Enterprise Resource Planning) management system. Built with a sleek Glassmorphism UI, it provides a seamless experience for managing stock receipts, warehouses, and storage locations.

### 🚀 Live Demo
**[Click here to view the live website] (Insert_Your_Live_Link_Here)**

---

## ✨ Key Features

* **🎨 Premium Glassmorphism UI:** A modern dark-theme interface with smooth transitions, backdrop blurs, and responsive design.
* **📋 Multi-View System:** Switch between traditional **List View** and an interactive **Kanban Board** instantly.
* **🖱️ Drag & Drop Kanban:** Move receipts between 'Draft', 'Ready', and 'Done' statuses using native HTML5 drag-and-drop.
* **📄 Automated Vouchers:** Double-click any receipt to open a professional, printable PDF document/voucher.
* **🏢 Relational Data Management:** * Create and manage **Warehouses**.
    * Create **Locations** that dynamically link to parent warehouses with auto-suggested location codes.
* **🛡️ Smart Validation:** Action alerts prevent users from printing or validating unreceived stock.

---

## 🛠️ Tech Stack

This project is built purely with native web technologies to ensure maximum performance and zero dependency overhead.
* **HTML5:** Semantic and accessible structure.
* **CSS3:** Custom variables, Flexbox/Grid, and Print media queries for PDF generation.
* **Vanilla JavaScript (ES6+):** DOM manipulation, event delegation, array filtering, and Drag & Drop API.
* **FontAwesome:** For intuitive iconography.

---

## 📂 Folder Structure

```text
coresync/
├── index.html           # Landing Page / Login (Future scope)
├── dashboard.html       # Main Dashboard view
├── receipts.html        # Stock In / Receipts management (List + Kanban)
├── receipts.css         # Styling for Receipts & Document Printer
├── receipts.js          # Logic for Receipts, Modals & Drag-Drop
├── warehouses.html      # Warehouse creation and management
├── warehouses.css
├── warehouses.js        
├── locations.html       # Child locations mapped to Warehouses
├── locations.css
└── locations.js         # Auto-code generation & linking logic
