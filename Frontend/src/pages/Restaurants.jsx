import { useState, useEffect } from 'react';
import restaurantService from '../services/restaurantService';
import RestaurantCard from '../components/RestaurantCard';
import './Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAll();
        setRestaurants(data);
      } catch (err) {
        setError('Failed to fetch restaurants. Make sure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="restaurants-page container">
      <div className="page-header">
        <h1 className="page-title">Explore Restaurants</h1>
        <p className="page-subtitle">Discover the best food around you.</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your next meal...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="empty-state">
          <p>No restaurants found. Try adding some from the backend!</p>
        </div>
      ) : (
        <div className="restaurants-grid">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
