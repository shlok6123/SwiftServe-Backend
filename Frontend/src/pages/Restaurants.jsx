import { useState, useEffect } from 'react';
import restaurantService from '../services/restaurantService';
import RestaurantCard from '../components/RestaurantCard';
import './Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchRestaurants = async (pageNum, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const data = await restaurantService.getAll('', pageNum, 8);
      // Spring Page object has content field
      const newRestaurants = data.content || [];
      
      if (isLoadMore) {
        setRestaurants(prev => [...prev, ...newRestaurants]);
      } else {
        setRestaurants(newRestaurants);
      }
      
      setHasMore(!data.last); // 'last' is a boolean in Spring Page object
    } catch (err) {
      setError('Failed to fetch restaurants. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(0);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRestaurants(nextPage, true);
  };

  return (
    <div className="restaurants-page container">
      <div className="page-header">
        <h1 className="page-title">Explore Restaurants</h1>
        <p className="page-subtitle">Discover the best food around you.</p>
      </div>

      {loading && restaurants.length === 0 ? (
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
        <>
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          
          {hasMore && (
            <div className="load-more-container">
              <button 
                className="btn btn-secondary" 
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More Restaurants'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Restaurants;
