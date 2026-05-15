import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="container empty-state mt-5">
        <h2>Please Login</h2>
        <p>You need to be logged in to view your cart.</p>
        <Link to="/login" className="btn btn-primary mt-3">Login to Continue</Link>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container empty-state mt-5">
        <ShoppingBag size={64} className="mb-3 text-secondary" />
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any delicious food yet!</p>
        <Link to="/restaurants" className="btn btn-primary mt-3">Browse Restaurants</Link>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!deliveryAddress) {
      setError('Please provide a delivery address');
      return;
    }

    setCheckingOut(true);
    setError('');

    try {
      const response = await orderService.checkout(deliveryAddress);
      if (response.success) {
        await clearCart();
        navigate('/orders', { state: { message: 'Order placed successfully!' } });
      } else {
        setError(response.message || 'Checkout failed');
      }
    } catch (err) {
      setError('An error occurred during checkout.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="container cart-page">
      <h1 className="page-title mb-4">Your Cart</h1>
      
      <div className="cart-layout">
        <div className="cart-items-container glass">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h4>{item.menuItem.name}</h4>
                <p className="text-secondary">${item.menuItem.price.toFixed(2)} each</p>
              </div>
              
              <div className="item-actions">
                <div className="quantity-controls">
                  <button 
                    className="btn-icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="btn-icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="item-total">
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="btn-icon delete-btn"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-container glass">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>$2.99</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>${(cart.totalPrice + 2.99).toFixed(2)}</span>
          </div>

          {error && <div className="error-message mt-3">{error}</div>}

          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="input-group">
              <label htmlFor="address">Delivery Address</label>
              <textarea 
                id="address"
                className="input-field" 
                rows="3"
                placeholder="123 Main St, Apt 4B..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={checkingOut}
            >
              {checkingOut ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
