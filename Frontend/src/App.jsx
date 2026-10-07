import { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider, useToast } from './context/ToastContext';
import {
  registerApiErrorHandler,
  registerUnauthorizedHandler,
} from './services/api';
import Navbar from './components/Navbar';
import ConnectionStatus from './components/ConnectionStatus';
import ScrollProgress from './components/ScrollProgress';
import RippleEffect from './components/RippleEffect';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OwnerDashboard from './pages/OwnerDashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import './index.css';

// Connects the API layer to the toast + auth systems so backend failures
// surface to the user instead of failing silently.
const ApiBridge = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout();
      navigate('/login', {
        state: { message: 'Your session expired. Please log in again.' },
      });
    });
  }, [logout, navigate]);

  // Keep the latest toast reference available to the api error handler.
  useEffect(() => {
    registerApiErrorHandler((message) => {
      toast.error(message);
    });
  }, [toast]);

  return null;
};

// Re-keys the page wrapper on navigation to replay the fade transition.
const AnimatedRoutes = () => {
  const location = useLocation();

  // Scroll to top on every route change for a clean entrance.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <main className="page-container">
      <div className="route-fade" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/driver" element={<DriverDashboard />} />
        </Routes>
      </div>
    </main>
  );
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ApiBridge />
            <ScrollProgress />
            <RippleEffect />
            <ConnectionStatus />
            <div className="app">
              <Navbar />
              <AnimatedRoutes />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
