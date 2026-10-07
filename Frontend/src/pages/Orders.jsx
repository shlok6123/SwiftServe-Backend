import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import orderSocket from '../services/orderSocket';
import Loader from '../components/Loader';
import { ShoppingBag, Clock, CheckCircle, Package, Radio } from 'lucide-react';
import './Orders.css';

const Orders = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Tracks which order rows just changed so we can flash a highlight.
  const [flashing, setFlashing] = useState({});
  const subsRef = useRef([]);

  const successMessage = location.state?.message;

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await orderService.getHistory();
      if (response.success && response.data) {
        setOrders(response.data.sort((a, b) => b.id - a.id));
      }
    } catch {
      setError('Failed to fetch order history.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Merge a pushed update into local state and flash the affected row.
  const applyLiveUpdate = useCallback((updated) => {
    if (!updated?.id) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
    );
    setFlashing((prev) => ({ ...prev, [updated.id]: true }));
    setTimeout(
      () => setFlashing((prev) => ({ ...prev, [updated.id]: false })),
      1500
    );
  }, []);

  // Subscribe to a live feed for every order currently on screen.
  useEffect(() => {
    if (!isAuthenticated || orders.length === 0) return;
    subsRef.current.forEach((unsub) => unsub());
    subsRef.current = orders.map((o) =>
      orderSocket.subscribeToOrder(o.id, applyLiveUpdate)
    );
    return () => {
      subsRef.current.forEach((unsub) => unsub());
      subsRef.current = [];
    };
    // Re-subscribe only when the set of order IDs changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, orders.map((o) => o.id).join(','), applyLiveUpdate]);

  if (!isAuthenticated) {
    return (
      <div className="container empty-state mt-5">
        <h2>Please Login</h2>
        <p>You need to be logged in to view your orders.</p>
        <Link to="/login" className="btn btn-primary mt-3">Login</Link>
      </div>
    );
  }

  if (loading)
    return (
      <div className="container">
        <Loader center label="Loading your orders…" />
      </div>
    );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="status-icon pending" />;
      case 'DELIVERED': return <CheckCircle className="status-icon delivered" />;
      default: return <Package className="status-icon processing" />;
    }
  };

  return (
    <div className="container orders-page">
      <div className="page-header anim-fade-down">
        <h1 className="page-title">Order History</h1>
        <p className="page-subtitle d-flex align-items-center gap-2">
          Track your recent food adventures.
          <span className="live-pill" title="Live updates active">
            <Radio size={13} /> Live
          </span>
        </p>
      </div>

      {successMessage && <div className="success-message mb-4 anim-fade-in">{successMessage}</div>}
      {error && <div className="error-message mb-4 anim-shake">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state glass anim-fade-in">
          <ShoppingBag size={64} className="mb-3 text-secondary anim-float" />
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Time to get hungry!</p>
          <Link to="/restaurants" className="btn btn-primary mt-3 shine">Find Food</Link>
        </div>
      ) : (
        <div className="orders-list stagger">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`order-card glass hover-lift ${flashing[order.id] ? 'anim-glow-pulse' : ''}`}
            >
              <div className="order-header">
                <div className="order-id">
                  <h3>Order #{order.id}</h3>
                  <span className="order-date">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>
                <div className={`order-status badge-${order.status.toLowerCase()}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
              
              <div className="order-body">
                <div className="restaurant-details">
                  <span className="text-secondary">From:</span>
                  <strong>{order.restaurantName}</strong>
                </div>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <span>{item.quantity}x {item.menuItemName}</span>
                      <span>${item.totalPrice?.toFixed(2) || '0.00'}</span>
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
                  <strong>${order.totalAmount?.toFixed(2) || '0.00'}</strong>
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
