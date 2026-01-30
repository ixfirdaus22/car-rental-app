import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { approveReview, rejectReview } from '../../services/api';
import api from '../../services/api';

export default function AdminReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === 'ALL') {
        response = await api.get('/admin/reviews');
      } else {
        response = await api.get(`/admin/reviews/status/${activeTab}`);
      }
      setReviews(response.data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in as an admin.');
      } else if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      }
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    if (!window.confirm('Are you sure you want to approve this review?')) {
      return;
    }

    try {
      await approveReview(reviewId);
      alert('Review approved successfully!');
      fetchReviews();
    } catch (err) {
      console.error('Error approving review:', err);
      let errorMessage = 'Failed to approve review';
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

  const handleReject = async (reviewId) => {
    if (!window.confirm('Are you sure you want to reject this review?')) {
      return;
    }

    try {
      await rejectReview(reviewId);
      alert('Review rejected successfully!');
      fetchReviews();
    } catch (err) {
      console.error('Error rejecting review:', err);
      let errorMessage = 'Failed to reject review';
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
      <h1 className="fw-bold mb-4">⭐ Manage Reviews</h1>

      {/* Status Tabs */}
      <ul className="nav nav-tabs mb-4">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'PENDING' ? 'Pending' : 
               tab === 'APPROVED' ? 'Approved' : 
               tab === 'REJECTED' ? 'Rejected' : tab}
              {tab !== 'ALL' && (
                <span className="badge bg-secondary ms-2">
                  {reviews.filter(r => r.status === tab).length}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading reviews...</p>
        </div>
      ) : (
        <>
          {(activeTab === 'ALL' ? reviews : reviews.filter(r => r.status === activeTab)).length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <p className="text-muted">No {activeTab === 'ALL' ? '' : activeTab.toLowerCase() + ' '}reviews found.</p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {(activeTab === 'ALL' ? reviews : reviews.filter(r => r.status === activeTab)).map(review => (
                <div key={review.id} className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1">{review.userName || 'Anonymous'}</h6>
                          <div className="text-warning mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-muted small mb-0">
                            Vehicle: {review.vehicleMake} {review.vehicleModel}
                          </p>
                        </div>
                        <small className="text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      {review.comment && (
                        <p className="mb-3">{review.comment}</p>
                      )}
                      {activeTab === 'PENDING' && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(review.id)}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReject(review.id)}
                          >
                            ✕ Reject
                          </button>
                        </div>
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
