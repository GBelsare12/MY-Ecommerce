import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

// --- App setup ---
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

// --- Database setup ---
const db = new Database('./ecommerce.db');

// Create tables if they don't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    qty INTEGER,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )
`).run();

// Seed default products (only if table is empty)
const count = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
if (count === 0) {
  const insert = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
  const defaultProducts = [
    ['Notebook', 50],
    ['Pen', 10],
    ['USB Drive', 400],
    ['Headphones', 1500],
    ['Mouse', 700],
    ['Keyboard', 1200],
  ];
  defaultProducts.forEach(p => insert.run(p[0], p[1]));
  console.log('🛍️ Default products inserted.');
}

// --- API Routes ---

// 1️⃣ Get all products
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

// 2️⃣ Get cart items
app.get('/api/cart', (req, res) => {
  const cartItems = db.prepare(`
    SELECT c.id, p.name, p.price, c.qty
    FROM cart c
    JOIN products p ON p.id = c.product_id
  `).all();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ cart: cartItems, total });
});

// 3️⃣ Add item to cart (or update qty)
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  const existing = db.prepare('SELECT * FROM cart WHERE product_id = ?').get(productId);

  if (existing) {
    db.prepare('UPDATE cart SET qty = qty + ? WHERE product_id = ?').run(qty, productId);
  } else {
    db.prepare('INSERT INTO cart (product_id, qty) VALUES (?, ?)').run(productId, qty);
  }

  res.json({ message: 'Cart updated' });
});

// 4️⃣ Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  db.prepare('DELETE FROM cart WHERE product_id = ?').run(req.params.id);
  res.json({ message: 'Item removed' });
});

// 5️⃣ Checkout
app.post('/api/checkout', (req, res) => {
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Clear cart after checkout
  db.prepare('DELETE FROM cart').run();

  const receipt = {
    id: Date.now(),
    items: cartItems,
    total,
    date: new Date().toLocaleString(),
  };
  res.json(receipt);
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
