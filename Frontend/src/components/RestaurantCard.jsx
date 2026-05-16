import { Star, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import favoriteService from '../services/favoriteService';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false); // Initial state should ideally come from props or a parent

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      const res = await favoriteService.toggleFavorite(restaurant.id);
      if (res.success) setIsFavorite(res.data);
    } catch (err) {
      console.error('Failed to toggle favorite');
    }
  };

  const imageUrl = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80&sig=${restaurant.id || Math.random()}`;

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card glass">
      <div className="restaurant-image">
        <img src={imageUrl} alt={restaurant.name} className="card-img" />
        {isAuthenticated && (
          <button className={`favorite-btn ${isFavorite ? 'active' : ''}`} onClick={handleFavorite}>
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
