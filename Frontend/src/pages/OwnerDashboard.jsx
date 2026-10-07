import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import restaurantService from '../services/restaurantService';
import orderService from '../services/orderService';
import orderSocket from '../services/orderSocket';
import { useToast } from '../context/ToastContext';
import { PlusCircle, Store, Trash2, ListOrdered, CheckCircle, Package, Clock, Eye, Radio } from 'lucide-react';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('restaurants'); // 'restaurants', 'add', 'orders'
  
  // Data states
  const [myRestaurants, setMyRestaurants] = useState([]);
  const [restaurantOrders, setRestaurantOrders] = useState([]);
  const [selectedRestaurantForOrders, setSelectedRestaurantForOrders] = useState('');
  const [flashing, setFlashing] = useState({});
  const orderSubRef = useRef(null);

  // Form states
  const [restaurantData, setRestaurantData] = useState({
    name: '', description: '', address: '', contactNumber: '', imageUrl: ''
  });

  const [menuItemData, setMenuItemData] = useState({
    name: '', description: '', price: '', category: '', restaurantId: '', isVeg: false, isAvailable: true, imageUrl: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const fetchMyRestaurants = useCallback(async () => {
    try {
      const response = await restaurantService.getMyRestaurants();
      if (response.success) {
        setMyRestaurants(response.data);
        setSelectedRestaurantForOrders((prev) =>
          prev || (response.data.length > 0 ? response.data[0].id : '')
        );
      }
    } catch (err) {
      console.error('Failed to fetch restaurants', err);
    }
  }, []);

  const fetchOrdersForRestaurant = useCallback(async (restaurantId) => {
    try {
      const response = await orderService.getRestaurantOrders(restaurantId);
      if (response.success) {
        setRestaurantOrders(response.data.sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.userRole === 'RESTAURANT_OWNER') {
      fetchMyRestaurants();
    }
  }, [isAuthenticated, user, fetchMyRestaurants]);

  useEffect(() => {
    if (selectedRestaurantForOrders) {
      fetchOrdersForRestaurant(selectedRestaurantForOrders);
    }
  }, [selectedRestaurantForOrders, fetchOrdersForRestaurant]);

  // Live feed: merge pushed orders (new or status changes) for this restaurant.
  useEffect(() => {
    if (!selectedRestaurantForOrders) return;
    if (orderSubRef.current) orderSubRef.current();

    orderSubRef.current = orderSocket.subscribeToRestaurant(
      selectedRestaurantForOrders,
      (incoming) => {
        if (!incoming?.id) return;
        setRestaurantOrders((prev) => {
          const exists = prev.some((o) => o.id === incoming.id);
          const next = exists
            ? prev.map((o) => (o.id === incoming.id ? { ...o, ...incoming } : o))
            : [incoming, ...prev];
          return next.sort((a, b) => b.id - a.id);
        });
        setFlashing((prev) => ({ ...prev, [incoming.id]: true }));
        setTimeout(
          () => setFlashing((prev) => ({ ...prev, [incoming.id]: false })),
          1500
        );
        toast.info(`Order #${incoming.id} is now ${incoming.status}`);
      }
    );

    return () => {
      if (orderSubRef.current) {
        orderSubRef.current();
        orderSubRef.current = null;
      }
    };
  }, [selectedRestaurantForOrders, toast]);

  const handleRestaurantChange = (e) => {
    setRestaurantData({ ...restaurantData, [e.target.name]: e.target.value });
  };

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuItemData({ ...menuItemData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/restaurants/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(restaurantData)
      }).then(res => res.json());

      if (response.success) {
        setMessage({ type: 'success', text: `Restaurant "${response.data.name}" added!` });
        setMenuItemData({ ...menuItemData, restaurantId: response.data.id });
        setRestaurantData({ name: '', description: '', address: '', contactNumber: '', imageUrl: '' });
        fetchMyRestaurants();
      } else {
         setMessage({ type: 'error', text: response.message || 'Failed to add restaurant' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to add restaurant' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...menuItemData, price: parseFloat(menuItemData.price) };
      const response = await fetch('http://localhost:8080/api/v1/Menu/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      }).then(res => res.json());

      if (response.success) {
        setMessage({ type: 'success', text: `Item "${response.data.name}" added to menu!` });
        setMenuItemData({ ...menuItemData, name: '', description: '', price: '', category: '', isVeg: false, isAvailable: true, imageUrl: '' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to add menu item' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to add menu item' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      const response = await restaurantService.deleteRestaurant(id);
      if (response.success) {
        setMessage({ type: 'success', text: 'Restaurant deleted successfully' });
        fetchMyRestaurants();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete restaurant' });
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, status);
      if (response.success) {
        fetchOrdersForRestaurant(selectedRestaurantForOrders);
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update order status' });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="status-icon pending" size={16} />;
      case 'DELIVERED': return <CheckCircle className="status-icon delivered" size={16} />;
      default: return <Package className="status-icon processing" size={16} />;
    }
  };

  // Protection
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.userRole !== 'RESTAURANT_OWNER') {
    return (
      <div className="container empty-state mt-5">
        <h2>Access Denied</h2>
        <p>You must be a Restaurant Owner to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Owner Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user.name}. Manage your business here.</p>
      </div>

      {message.text && (
        <div className={`message-box ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
          {message.text}
        </div>
      )}

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          <Store size={18} /> My Restaurants
        </button>
        <button 
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <PlusCircle size={18} /> Add New
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ListOrdered size={18} /> Order Management
        </button>
      </div>

      <div className="tab-content">
        {/* TAB 1: MY RESTAURANTS */}
        {activeTab === 'restaurants' && (
          <div className="my-restaurants-tab">
            {myRestaurants.length === 0 ? (
              <div className="empty-state glass">
                <Store size={48} className="mb-3 text-secondary" />
                <h3>No Restaurants Found</h3>
                <p>You haven't added any restaurants yet.</p>
                <button className="btn btn-primary mt-3" onClick={() => setActiveTab('add')}>
                  Add Your First Restaurant
                </button>
              </div>
            ) : (
              <div className="dashboard-grid">
                {myRestaurants.map(restaurant => (
                  <div key={restaurant.id} className="dashboard-card glass restaurant-list-card">
                    <div className="card-header justify-between">
                      <div className="d-flex align-items-center gap-2">
                        <Store className="header-icon" />
                        <h2>{restaurant.name}</h2>
                      </div>
                      <span className="badge badge-primary">ID: {restaurant.id}</span>
                    </div>
                    <p className="text-secondary">{restaurant.address}</p>
                    <p className="text-secondary mb-3">📞 {restaurant.contactNumber}</p>
                    <div className="card-actions">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedRestaurantForOrders(restaurant.id);
                          setActiveTab('orders');
                        }}
                      >
                        <Eye size={16} /> View Orders
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADD FORMS */}
        {activeTab === 'add' && (
          <div className="dashboard-grid">
            {/* ADD RESTAURANT CARD */}
            <div className="dashboard-card glass">
              <div className="card-header">
                <Store className="header-icon" />
                <h2>Register New Restaurant</h2>
              </div>
              <form onSubmit={handleAddRestaurant} className="dashboard-form">
                <div className="input-group">
                  <label>Restaurant Name</label>
                  <input type="text" name="name" className="input-field" value={restaurantData.name} onChange={handleRestaurantChange} required />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <input type="text" name="description" className="input-field" value={restaurantData.description} onChange={handleRestaurantChange} required />
                </div>
                <div className="input-group">
                  <label>Address</label>
                  <input type="text" name="address" className="input-field" value={restaurantData.address} onChange={handleRestaurantChange} required />
                </div>
                <div className="input-group">
                  <label>Contact Number</label>
                  <input type="text" name="contactNumber" className="input-field" value={restaurantData.contactNumber} onChange={handleRestaurantChange} required />
                </div>
                <div className="input-group">
                  <label>Image URL (optional)</label>
                  <input type="text" name="imageUrl" className="input-field" value={restaurantData.imageUrl} onChange={handleRestaurantChange} />
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                  Create Restaurant
                </button>
              </form>
            </div>

            {/* ADD MENU ITEM CARD */}
            <div className="dashboard-card glass">
              <div className="card-header">
                <PlusCircle className="header-icon" />
                <h2>Add Menu Item</h2>
              </div>
              <p className="text-secondary mb-3 text-sm">You must enter your Restaurant ID first.</p>
              <form onSubmit={handleAddMenuItem} className="dashboard-form">
                <div className="input-group">
                  <label>Restaurant ID</label>
                  <input type="number" name="restaurantId" className="input-field" value={menuItemData.restaurantId} onChange={handleMenuChange} required />
                </div>
                <div className="input-group">
                  <label>Item Name</label>
                  <input type="text" name="name" className="input-field" value={menuItemData.name} onChange={handleMenuChange} required />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <input type="text" name="description" className="input-field" value={menuItemData.description} onChange={handleMenuChange} required />
                </div>
                <div className="grid-2-col">
                  <div className="input-group">
                    <label>Price ($)</label>
                    <input type="number" step="0.01" name="price" className="input-field" value={menuItemData.price} onChange={handleMenuChange} required />
                  </div>
                  <div className="input-group">
                    <label>Category</label>
                    <input type="text" name="category" className="input-field" value={menuItemData.category} onChange={handleMenuChange} required />
                  </div>
                </div>
                <div className="input-group mt-2">
                  <label>Image URL (optional)</label>
                  <input type="text" name="imageUrl" className="input-field" value={menuItemData.imageUrl} onChange={handleMenuChange} />
                </div>
                <div className="grid-2-col mt-2">
                  <label className="checkbox-label">
                    <input type="checkbox" name="isVeg" checked={menuItemData.isVeg} onChange={handleMenuChange} />
                    🌿 Vegetarian
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="isAvailable" checked={menuItemData.isAvailable} onChange={handleMenuChange} />
                    ✅ Available
                  </label>
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                  Add to Menu
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="order-management-tab">
            <div className="dashboard-card glass mb-4">
              <div className="input-group mb-0">
                <label>Select Restaurant to View Orders:</label>
                <select 
                  className="input-field"
                  value={selectedRestaurantForOrders}
                  onChange={(e) => setSelectedRestaurantForOrders(e.target.value)}
                >
                  <option value="">-- Select a restaurant --</option>
                  {myRestaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (ID: {r.id})</option>
                  ))}
                </select>
              </div>
              {selectedRestaurantForOrders && (
                <span className="live-pill mt-2" title="Live order feed active">
                  <Radio size={13} /> Live feed on
                </span>
              )}
            </div>

            {!selectedRestaurantForOrders ? (
              <div className="empty-state glass">
                <p>Please select a restaurant above to view its orders.</p>
              </div>
            ) : restaurantOrders.length === 0 ? (
              <div className="empty-state glass">
                <ListOrdered size={48} className="mb-3 text-secondary" />
                <h3>No Orders Yet</h3>
                <p>There are no orders for this restaurant.</p>
              </div>
            ) : (
              <div className="orders-list">
                {restaurantOrders.map(order => (
                  <div key={order.id} className={`order-card glass hover-lift ${flashing[order.id] ? 'anim-glow-pulse' : ''}`}>
                    <div className="order-header">
                      <div className="order-id">
                        <h3>Order #{order.id}</h3>
                        <span className="order-date">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}</span>
                      </div>
                      <div className={`order-status badge-${order.status.toLowerCase()}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="order-body">
                      <div className="customer-details mb-2">
                        <span className="text-secondary">Customer: </span>
                        <strong>{order.customerName}</strong>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <span>{item.quantity}x {item.menuItemName}</span>
                            <span>${item.totalPrice?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="order-footer flex-column align-items-start">
                      <div className="w-100 d-flex justify-between mb-3">
                        <div className="delivery-address">
                          <span className="text-secondary">Delivery: </span>
                          <span>{order.deliveryAddress}</span>
                        </div>
                        <div className="order-total">
                          <strong>${order.totalAmount?.toFixed(2)}</strong>
                        </div>
                      </div>
                      
                      <div className="status-actions w-100">
                        <span className="text-sm text-secondary mr-2">Update Status:</span>
                        <div className="d-flex gap-2 mt-1">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                            disabled={order.status === 'PREPARING' || order.status === 'DELIVERED'}
                          >
                            Preparing
                          </button>
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleUpdateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                            disabled={order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED'}
                          >
                            Out for Delivery
                          </button>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                            disabled={order.status === 'DELIVERED'}
                          >
                            Mark Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
