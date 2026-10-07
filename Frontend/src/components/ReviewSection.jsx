import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import reviewService from '../services/reviewService';
import { Star, Send, User } from 'lucide-react';
import './ReviewSection.css';

const ReviewSection = ({ restaurantId }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const res = await reviewService.getRestaurantReviews(restaurantId);
      if (res.success) setReviews(res.data);
    } catch {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    setSubmitting(true);
    try {
      const res = await reviewService.addReview({
        ...newReview,
        restaurantId: parseInt(restaurantId)
      });
      if (res.success) {
        setReviews([res.data, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        setMessage('Review posted!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      console.error('Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-section mt-5">
      <h2 className="section-title">Customer Reviews</h2>

      {isAuthenticated && (
        <div className="add-review-box glass p-4 mb-5">
          <h4>Leave a Review</h4>
          <form onSubmit={handleSubmit}>
            <div className="rating-selector mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star 
                  key={num}
                  size={24}
                  fill={num <= newReview.rating ? "#ffb700" : "none"}
                  color={num <= newReview.rating ? "#ffb700" : "#666"}
                  className="star-icon"
                  onClick={() => setNewReview({ ...newReview, rating: num })}
                />
              ))}
            </div>
            <textarea 
              className="input-field mb-3"
              placeholder="Share your experience..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            ></textarea>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Posting...' : <><Send size={18} className="mr-2 inline" /> Post Review</>}
            </button>
            {message && <span className="ml-3 text-success">{message}</span>}
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4"><div className="spinner mx-auto"></div></div>
      ) : reviews.length === 0 ? (
        <div className="empty-state text-secondary">No reviews yet. Be the first to review!</div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card glass p-3 mb-3">
              <div className="review-header d-flex justify-between align-items-center mb-2">
                <div className="reviewer d-flex align-items-center gap-2">
                  <div className="reviewer-avatar"><User size={16} /></div>
                  <span className="reviewer-name">{review.customerName}</span>
                </div>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Star 
                      key={num}
                      size={14}
                      fill={num <= review.rating ? "#ffb700" : "none"}
                      color={num <= review.rating ? "#ffb700" : "#444"}
                    />
                  ))}
                </div>
              </div>
              <p className="review-comment mb-1">{review.comment}</p>
              <span className="review-date text-secondary">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
