import React from 'react';

const CartItem = ({ item, onRemove, onQuantityChange }) => {
    const handleQuantityChange = (e) => {
        onQuantityChange(item.id, e.target.value);
    };

    return (
        <div className="cart-item" style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '1.2rem 1.5rem', margin: '1.2rem 0', gap: 24 }}>
            <img src={item.image} alt={item.title} style={{ width: 90, height: 90, objectFit: 'contain', borderRadius: 10, background: '#f3f4f6', marginRight: 18 }} />
            <div className="item-details" style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#2d2d2d', fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: '#4f46e5', fontWeight: 600, margin: '0.5rem 0 0.7rem 0' }}>Price: ₹{(item.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input 
                        type="number" 
                        value={item.quantity} 
                        min="1" 
                        onChange={handleQuantityChange} 
                        style={{ width: 56, padding: 6, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
                    />
                    <button onClick={() => onRemove(item.id)} style={{ background: 'linear-gradient(90deg, #ff3b3b 60%, #f87171 100%)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 15, boxShadow: '0 1px 4px rgba(255,59,59,0.08)', transition: 'background 0.2s, transform 0.15s' }}>Remove</button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;