import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import { ShoppingBag, Clock, CheckCircle, Package } from 'lucide-react';
import './Orders.css';

const Orders = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const successMessage = location.state?.message;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await orderService.getHistory();
        if (response.success && response.data) {
          // Sort by newest first assuming IDs are sequential or there's a timestamp
          setOrders(response.data.sort((a, b) => b.id - a.id));
        }
      } catch (err) {
        setError('Failed to fetch order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container empty-state mt-5">
        <h2>Please Login</h2>
        <p>You need to be logged in to view your orders.</p>
        <Link to="/login" className="btn btn-primary mt-3">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="container loading-state"><div className="spinner"></div></div>;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="status-icon pending" />;
      case 'DELIVERED': return <CheckCircle className="status-icon delivered" />;
      default: return <Package className="status-icon processing" />;
    }
  };

  return (
    <div className="container orders-page">
      <div className="page-header">
        <h1 className="page-title">Order History</h1>
        <p className="page-subtitle">Track your recent food adventures.</p>
      </div>

      {successMessage && <div className="success-message mb-4">{successMessage}</div>}
      {error && <div className="error-message mb-4">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state glass">
          <ShoppingBag size={64} className="mb-3 text-secondary" />
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Time to get hungry!</p>
          <Link to="/restaurants" className="btn btn-primary mt-3">Find Food</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card glass">
              <div className="order-header">
                <div className="order-id">
                  <h3>Order #{order.id}</h3>
                  <span className="order-date">{new Date().toLocaleDateString()}</span>
                </div>
                <div className={`order-status badge-${order.orderStatus.toLowerCase()}`}>
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus}
                </div>
              </div>
              
              <div className="order-body">
                <div className="restaurant-details">
                  <span className="text-secondary">From:</span>
                  <strong>{order.restaurant.name}</strong>
                </div>
                <div className="order-items">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="order-footer">
                <div className="delivery-address">
                  <span className="text-secondary">Delivering to:</span>
                  <p>{order.deliveryAddress}</p>
                </div>
                <div className="order-total">
                  <span>Total:</span>
                  <strong>${order.totalPrice.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
