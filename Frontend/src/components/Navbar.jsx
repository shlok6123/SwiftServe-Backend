import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, UtensilsCrossed, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(cartItemCount);

  // Shrink + intensify the navbar glass once the user scrolls down.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pop the cart badge whenever the item count increases.
  useEffect(() => {
    if (cartItemCount > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 450);
      prevCount.current = cartItemCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartItemCount;
  }, [cartItemCount]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar glass ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <UtensilsCrossed className="logo-icon anim-wiggle" />
          <span className="text-gradient">SwiftServe</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/restaurants" className="nav-link link-underline">Restaurants</Link>
          {isAuthenticated && <Link to="/orders" className="nav-link link-underline">Orders</Link>}
          {isAuthenticated && user?.userRole === 'RESTAURANT_OWNER' && (
            <Link to="/dashboard" className="nav-link link-underline text-gradient">Dashboard</Link>
          )}
          {isAuthenticated && user?.userRole === 'DRIVER' && (
            <Link to="/driver" className="nav-link link-underline text-gradient">Driver Portal</Link>
          )}
          {isAuthenticated && user?.userRole === 'ADMIN' && (
            <Link to="/admin" className="nav-link link-underline text-gradient">Admin Panel</Link>
          )}
        </div>
        
        <div className="navbar-actions">
          <Link to="/cart" className="nav-action-icon">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className={`cart-badge ${bump ? 'anim-badge-bump' : ''}`}>
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              <Link to="/profile" className="btn btn-secondary btn-sm" title="Profile">
                <User size={18} />
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
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
