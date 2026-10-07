import { Star, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import favoriteService from '../services/favoriteService';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant, initialFavorite }) => {
  const { isAuthenticated } = useContext(AuthContext);
  // Initialize from an explicit prop, falling back to a backend flag if present.
  const resolveFavorite = () =>
    initialFavorite ?? restaurant?.favorite ?? restaurant?.isFavorite ?? false;
  const [isFavorite, setIsFavorite] = useState(resolveFavorite);
  const [beat, setBeat] = useState(false);

  // Keep local state in sync if the parent re-fetches favorite status.
  useEffect(() => {
    setIsFavorite(resolveFavorite());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFavorite, restaurant?.favorite, restaurant?.isFavorite]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    // Play the heartbeat pop immediately for snappy feedback.
    setBeat(true);
    setTimeout(() => setBeat(false), 600);
    try {
      const res = await favoriteService.toggleFavorite(restaurant.id);
      if (res.success) setIsFavorite(res.data);
    } catch {
      console.error('Failed to toggle favorite');
    }
  };

  // Deterministic image per restaurant id (no impure Math.random in render).
  const imageUrl = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80&sig=${restaurant.id ?? 'placeholder'}`;

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card glass hover-lift glow-border shine">
      <div className="restaurant-image img-zoom">
        <img src={imageUrl} alt={restaurant.name} className="card-img" />
        {isAuthenticated && (
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''} ${beat ? 'anim-heartbeat' : ''}`}
            onClick={handleFavorite}
          >
            <Heart size={20} fill={isFavorite ? "#ff4757" : "none"} color={isFavorite ? "#ff4757" : "#fff"} />
          </button>
        )}
      </div>
      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        <p className="restaurant-cuisine">{restaurant.cuisine || 'Various Cuisines'}</p>
        
        <div className="restaurant-meta">
          <div className="meta-item">
            <Star size={16} className="icon-star" fill="currentColor" />
            <span>{restaurant.rating || '4.5'}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} className="icon-clock" />
            <span>20-30 min</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
