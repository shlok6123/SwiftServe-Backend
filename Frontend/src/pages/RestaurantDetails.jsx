import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantService from '../services/restaurantService';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await restaurantService.getById(id);
        if (response.success) {
          setRestaurant(response.data);
        } else {
          setError('Restaurant not found');
        }
      } catch (err) {
        setError('Failed to fetch restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  const handleAddToCart = async (menuItemId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to add items to your cart.' } });
      return;
    }
    await addToCart(menuItemId, 1);
    // Could add a nice toast notification here!
  };

  if (loading) return <div className="container loading-state"><div className="spinner"></div></div>;
  if (error) return <div className="container error-message mt-4">{error}</div>;
  if (!restaurant) return null;

  // Generate deterministic hero image based on restaurant ID
  const heroImageUrl = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop&q=80&sig=${restaurant.id || Math.random()}`;

  return (
    <div className="restaurant-details-page">
      <div className="restaurant-hero" style={{ backgroundImage: `url(${heroImageUrl})` }}>
        <div className="hero-overlay">
          <div className="container hero-content">
            <h1 className="restaurant-title">{restaurant.name}</h1>
            <p className="restaurant-cuisine">{restaurant.cuisine || restaurant.address}</p>
            <div className="restaurant-meta">
              <span className="rating">⭐ {restaurant.rating || '4.5'}</span>
              {restaurant.contactNumber && <span>📞 {restaurant.contactNumber}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="container menu-section">
        <h2 className="menu-title">Menu Items</h2>
        
        {(!restaurant.menuItems || restaurant.menuItems.length === 0) ? (
          <div className="empty-state">No menu items available for this restaurant.</div>
        ) : (
          <div className="menu-grid">
            {restaurant.menuItems.map(item => (
              <div key={item.id} className="menu-item-card glass">
                <div className="menu-item-info">
                  <div className="item-header">
                    <h3>{item.name}</h3>
                    <span className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                      {item.isVeg ? '🌿 Veg' : '🥩 Non-Veg'}
                    </span>
                  </div>
                  <p className="item-description">{item.description}</p>
                  <span className="item-price">${item.price?.toFixed(2) || '0.00'}</span>
                </div>
                <button 
                  className="btn btn-primary add-btn" 
                  onClick={() => handleAddToCart(item.id)}
                  disabled={!item.isAvailable}
                >
                  <Plus size={20} />
                  {item.isAvailable ? 'Add' : 'Sold Out'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
