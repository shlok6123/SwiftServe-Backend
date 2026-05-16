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
  const [filters, setFilters] = useState({ cuisine: '', rating: '' });

  const fetchRestaurants = async (pageNum, isLoadMore = false, currentFilters = filters) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const data = await restaurantService.getAll('', pageNum, 8, currentFilters.cuisine, currentFilters.rating);
      const newRestaurants = data.content || [];
      
      if (isLoadMore) {
        setRestaurants(prev => [...prev, ...newRestaurants]);
      } else {
        setRestaurants(newRestaurants);
      }
      
      setHasMore(!data.last);
    } catch (err) {
      setError('Failed to fetch restaurants.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchRestaurants(0, false);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRestaurants(nextPage, true);
  };

  return (
    <div className="restaurants-page container">
      <div className="page-header d-flex justify-between align-items-end">
        <div>
          <h1 className="page-title">Explore Restaurants</h1>
          <p className="page-subtitle">Discover the best food around you.</p>
        </div>
        
        <div className="filters-bar d-flex gap-3">
          <select name="cuisine" className="input-field" value={filters.cuisine} onChange={handleFilterChange}>
            <option value="">All Cuisines</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="American">American</option>
          </select>
          
          <select name="rating" className="input-field" value={filters.rating} onChange={handleFilterChange}>
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>
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
