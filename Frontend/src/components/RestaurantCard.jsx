import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  // Use the ID to get a deterministic image from Unsplash Source
  const imageUrl = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80&sig=${restaurant.id || Math.random()}`;

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card glass">
      <div className="restaurant-image">
        <img src={imageUrl} alt={restaurant.name} className="card-img" />
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
