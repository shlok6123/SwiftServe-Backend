import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, UtensilsCrossed, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <UtensilsCrossed className="logo-icon" />
          <span className="text-gradient">SwiftServe</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
          {isAuthenticated && <Link to="/orders" className="nav-link">Orders</Link>}
          {isAuthenticated && user?.userRole === 'RESTAURANT_OWNER' && (
            <Link to="/dashboard" className="nav-link text-gradient">Dashboard</Link>
          )}
        </div>
        
        <div className="navbar-actions">
          <Link to="/cart" className="nav-action-icon">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>
          
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <User size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
