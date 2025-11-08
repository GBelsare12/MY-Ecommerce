# 🛍️ MY-Ecommerce

A simple student-built **E-commerce Web Application** built with **React (Frontend)**, **Node.js + Express (Backend)**, and **SQLite (Database)**.

This project demonstrates a full-stack workflow — from backend API creation to frontend integration — using modern JavaScript tools in a clean, minimal design.

---

## 🚀 Features

### 🧩 Backend (Node.js + Express + SQLite)
- REST APIs for products, cart, and checkout
- Persistent storage using SQLite database
- Automatic product seeding (on first run)
- JSON-based API responses

### 🎨 Frontend (React + Vite)
- Product grid with Add to Cart functionality  
- Cart view (quantity update, remove, total)
- Checkout form with mock receipt modal
- Responsive UI with **Dark/Light theme toggle**
- Local storage theme persistence

---

## ⚙️ Installation & Run Steps

### 🔧 1. Clone the repository
```bash
git clone https://github.com/GBelsare12/MY-Ecommerce.git
cd MY-Ecommerce
🧠 2. Backend Setup
cd backend
npm install
npm run dev


Backend runs on http://localhost:5000

💻 3. Frontend Setup

Open a new terminal:

cd frontend
npm install
npm run dev


Frontend runs on http://localhost:5173

🧰 API Endpoints
Method	Endpoint	Description
GET	/api/products	Get product list
POST	/api/cart	Add item to cart
DELETE	/api/cart/:id	Remove item from cart
GET	/api/cart	Get current cart & total
POST	/api/checkout	Checkout (mock receipt)

