import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import adminService from '../services/adminService';
import { Users, Store, ClipboardList, Trash2, ShieldAlert } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.userRole === 'ADMIN') {
      fetchData();
    }
  }, [activeTab]);

  if (!isAuthenticated || user?.userRole !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (activeTab === 'users') res = await adminService.getUsers();
      else if (activeTab === 'restaurants') res = await adminService.getRestaurants();
      else if (activeTab === 'orders') res = await adminService.getOrders();

      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await adminService.deleteUser(id);
        if (res.success) fetchData();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        const res = await adminService.deleteRestaurant(id);
        if (res.success) fetchData();
      } catch (err) {
        alert('Failed to delete restaurant');
      }
    }
  };

  return (
    <div className="container admin-dashboard">
      <div className="dashboard-header d-flex align-items-center gap-3 mb-4">
        <div className="admin-icon-bg">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="mb-0">Admin Control Panel</h1>
          <p className="text-secondary">Platform-wide management and monitoring</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} /> Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          <Store size={20} /> Restaurants
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ClipboardList size={20} /> Orders
        </button>
      </div>

      <div className="admin-content glass p-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner mx-auto"></div></div>
        ) : error ? (
          <div className="error-message text-center py-5">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                {activeTab === 'users' && (
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'restaurants' && (
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'orders' && (
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    {activeTab === 'users' && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td><span className={`badge badge-${item.userRole.toLowerCase()}`}>{item.userRole}</span></td>
                        <td>
                          <button 
                            className="btn-icon delete-btn" 
                            onClick={() => handleDeleteUser(item.id)}
                            disabled={item.id === user.id}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === 'restaurants' && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.owner?.name || 'Unknown'}</td>
                        <td>{item.isOpen ? 'Open' : 'Closed'}</td>
                        <td>
                          <button className="btn-icon delete-btn" onClick={() => handleDeleteRestaurant(item.id)}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === 'orders' && (
                      <>
                        <td>{item.id}</td>
                        <td>{item.customerName}</td>
                        <td>{item.restaurantName}</td>
                        <td>${item.totalAmount?.toFixed(2)}</td>
                        <td>{item.status}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
