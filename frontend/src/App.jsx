import React from "react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import ReceiptModal from './ReceiptModal';

const API = 'http://localhost:5000/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark' } catch(e){ return false }
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const loadProducts = async () => {
    const { data } = await axios.get(`${API}/products`);
    setProducts(data);
    setLoading(false);
  };

  const loadCart = async () => {
    const { data } = await axios.get(`${API}/cart`);
    setCart(data.cart);
    setTotal(data.total);
  };

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const addToCart = async (productId) => {
    await axios.post(`${API}/cart`, { productId, qty: 1 });
    toast.success('Added to cart');
    loadCart();
  };

  const removeFromCart = async (productId) => {
    await axios.delete(`${API}/cart/${productId}`);
    toast('Removed from cart');
    loadCart();
  };

  const updateQty = async (productId, delta) => {
    const item = cart.find(i => i.id === productId);
    const newQty = (item?.qty || 0) + delta;
    if (newQty <= 0) return removeFromCart(productId);
    await axios.post(`${API}/cart`, { productId, qty: delta });
    loadCart();
  };

  const checkout = async () => {
    if (!user.name || !user.email) {
      toast.error('Please enter name & email');
      return;
    }
    const { data } = await axios.post(`${API}/checkout`, { cartItems: cart });
    setReceipt(data);
    toast.success('Checkout complete 🎉');
    loadCart();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-wrap">
      <Toaster />
      <header className="app-header">
        <div>
          <h1>MY-Ecommerce</h1>
        
        </div>
        <div className="header-actions">
          <input className="search" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
          <button className="theme-btn" onClick={()=>setDark(d=>!d)}>{dark ? '☀️ Light' : '🌙 Dark'}</button>
          <div className="cart-badge">🛒 {cart.reduce((s,i)=>s+i.qty,0)}</div>
        </div>
      </header>

      <main className="container">
        <section>
          <h2>Products</h2>
          {loading ? <p>Loading...</p> : (
            <div className="grid">
              {filtered.map(p=>(
                <div key={p.id} className="card">
                  <div className="card-title">{p.name}</div>
                  <div className="price">₹{p.price}</div>
                  <button className="btn" onClick={()=>addToCart(p.id)}>Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="cart-panel">
          <h3>Your Cart</h3>
          {cart.length===0 ? <p className="muted">Cart is empty</p> : (
            <div>
              {cart.map(item=>(
                <div key={item.id} className="cart-item">
                  <div>
                    <div className="cart-name">{item.name}</div>
                    <div className="muted">₹{item.price} × {item.qty}</div>
                  </div>
                  <div className="cart-actions">
                    <button onClick={()=>updateQty(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={()=>updateQty(item.id, +1)}>+</button>
                    <button className="remove" onClick={()=>removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="total">Total: ₹{total}</div>
              <div className="checkout">
                <input placeholder="Name" onChange={e=>setUser({...user, name: e.target.value})} />
                <input placeholder="Email" onChange={e=>setUser({...user, email: e.target.value})} />
                <button className="btn primary" onClick={checkout}>Checkout</button>
              </div>
            </div>
          )}
        </aside>
      </main>

      <ReceiptModal receipt={receipt} onClose={()=>setReceipt(null)} />
    </div>
  );
}
