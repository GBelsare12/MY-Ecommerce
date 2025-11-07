import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data.sqlite');
const firstTime = !fs.existsSync(dbPath);
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    FOREIGN KEY (productId) REFERENCES products(id)
  );
`);

if (firstTime) {
  const seed = db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)');
  const items = [
    [1, 'Wireless Headphones', 2999],
    [2, 'Smart Watch', 3999],
    [3, 'Bluetooth Speaker', 2499],
    [4, 'Gaming Mouse', 1499],
    [5, 'Mechanical Keyboard', 3499],
    [6, 'USB-C Charger 30W', 1299],
    [7, '1080p Webcam', 2199],
    [8, 'Laptop Stand', 1699]
  ];
  const trx = db.transaction((rows) => rows.forEach(r => seed.run(...r)));
  trx(items);
}

export default db;
