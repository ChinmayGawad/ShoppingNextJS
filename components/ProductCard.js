import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <p>₹{(product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        </div>
    );
};

export default ProductCard;