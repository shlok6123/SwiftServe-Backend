import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Register.css'; // Let's use specific CSS or reuse Login's

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userRole: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      if (response.success) {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container container">
      <div className="auth-card glass fade-in">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join SwiftServe and get your food fast.</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              className="input-field" 
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className="input-field" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className="input-field" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="userRole">Account Type</label>
            <select 
              id="userRole" 
              name="userRole" 
              className="input-field select-field"
              value={formData.userRole}
              onChange={handleChange}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="RESTAURANT_OWNER">Restaurant Owner</option>
              <option value="DRIVER">Driver</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
