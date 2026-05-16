import { useState, useContext, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import { User, Mail, Shield, Save, ListOrdered } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, login } = useContext(AuthContext); // Re-using login function to update context user if needed

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authService.updateProfile(formData);
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container profile-page">
      <div className="page-header text-center">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account details.</p>
      </div>

      <div className="profile-container glass mx-auto">
        <div className="profile-header text-center mb-4">
          <div className="profile-avatar">
            <User size={64} className="text-secondary" />
          </div>
          <h2 className="mt-3">{user.name}</h2>
          <span className={`badge badge-${user.userRole.toLowerCase()}`}>
            {user.userRole.replace('_', ' ')}
          </span>
        </div>

        {message.text && (
          <div className={`message-box ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <label><User size={16} className="mr-2 inline" /> Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="input-field" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label><Mail size={16} className="mr-2 inline" /> Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="input-field" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label><Shield size={16} className="mr-2 inline" /> Account Type</label>
            <input 
              type="text" 
              className="input-field disabled-input" 
              value={user.userRole.replace('_', ' ')} 
              disabled 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-4" disabled={loading}>
            {loading ? 'Saving...' : <><Save size={18} className="mr-2 inline" /> Save Changes</>}
          </button>
        </form>

        <div className="profile-actions mt-4 text-center border-top pt-4">
          <Link to="/orders" className="btn btn-outline">
            <ListOrdered size={18} className="mr-2 inline" /> View Order History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
