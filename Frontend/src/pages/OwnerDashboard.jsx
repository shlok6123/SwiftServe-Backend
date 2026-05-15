import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, Store } from 'lucide-react';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const [restaurantData, setRestaurantData] = useState({
    name: '',
    description: '',
    address: '',
    contactNumber: '',
    imageUrl: ''
  });

  const [menuItemData, setMenuItemData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    restaurantId: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

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

  const handleRestaurantChange = (e) => {
    setRestaurantData({ ...restaurantData, [e.target.name]: e.target.value });
  };

  const handleMenuChange = (e) => {
    setMenuItemData({ ...menuItemData, [e.target.name]: e.target.value });
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/restaurants/add', restaurantData);
      if (response.data.success) {
        setMessage({ type: 'success', text: `Restaurant "${response.data.data.name}" added! (ID: ${response.data.data.id})` });
        // Auto-fill the restaurant ID for the menu form
        setMenuItemData({ ...menuItemData, restaurantId: response.data.data.id });
        setRestaurantData({ name: '', description: '', address: '', contactNumber: '', imageUrl: '' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add restaurant' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...menuItemData, price: parseFloat(menuItemData.price) };
      const response = await api.post('/Menu/add', payload);
      if (response.data.success) {
        setMessage({ type: 'success', text: `Item "${response.data.data.name}" added to menu!` });
        setMenuItemData({ ...menuItemData, name: '', description: '', price: '', category: '' }); // keep restaurantId
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add menu item' });
    } finally {
      setLoading(false);
    }
  };

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
            <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
              Add to Menu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
