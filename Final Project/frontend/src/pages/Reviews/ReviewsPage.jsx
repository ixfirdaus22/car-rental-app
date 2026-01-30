import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReview, getReviewsByVehicleId } from '../../services/api';
import { useAuth } from '../../context';

export default function ReviewsPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (vehicleId) {
      fetchReviews();
    }
  }, [vehicleId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviewsByVehicleId(parseInt(vehicleId));
      setReviews(response.data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to submit a review');
      navigate('/login');
      return;
    }

    try {
      await createReview({
        vehicleId: parseInt(vehicleId),
        rating: formData.rating,
        comment: formData.comment
      });
      alert('Review submitted successfully! It will be visible after admin approval.');
      setFormData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error('Error submitting review:', err);
      let errorMessage = 'Failed to submit review';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      alert(errorMessage);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">⭐ Reviews</h1>
        {user && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : '+ Add Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && user && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Write a Review</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  required
                >
                  <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 ⭐⭐⭐⭐</option>
                  <option value={3}>3 ⭐⭐⭐</option>
                  <option value={2}>2 ⭐⭐</option>
                  <option value={1}>1 ⭐</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading reviews...</p>
        </div>
      ) : (
        <>
          {reviews.length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <h4 className="text-muted">No Reviews Yet</h4>
                <p className="text-muted">Be the first to review this vehicle!</p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {reviews.map(review => (
                <div key={review.id} className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{review.userName || 'Anonymous'}</h6>
                          <div className="text-warning mb-2">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      {review.comment && (
                        <p className="mb-0">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
