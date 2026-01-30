import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint, getUserComplaints } from '../../services/api';
import { useAuth } from '../../context';

export default function ComplaintsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    bookingId: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchComplaints();
  }, [user, navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getUserComplaints();
      setComplaints(response.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const complaintData = {
        subject: formData.subject,
        description: formData.description
      };
      
      if (formData.bookingId) {
        complaintData.bookingId = parseInt(formData.bookingId);
      }

      await createComplaint(complaintData);
      alert('Complaint submitted successfully! We will review it and get back to you soon.');
      setFormData({ subject: '', description: '', bookingId: '' });
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      console.error('Error submitting complaint:', err);
      let errorMessage = 'Failed to submit complaint';
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'RESOLVED':
        return <span className="badge bg-success">Resolved</span>;
      case 'CLOSED':
        return <span className="badge bg-secondary">Closed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">📝 My Complaints</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Raise Complaint'}
        </button>
      </div>

      {/* Complaint Form */}
      {showForm && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Raise a Complaint</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Subject *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your complaint"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Please provide detailed information about your complaint..."
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Booking ID (Optional)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.bookingId}
                  onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                  placeholder="If related to a specific booking"
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit Complaint</button>
            </form>
          </div>
        </div>
      )}

      {/* Complaints List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading complaints...</p>
        </div>
      ) : (
        <>
          {complaints.length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <h4 className="text-muted">No Complaints</h4>
                <p className="text-muted">You haven't raised any complaints yet.</p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {complaints.map(complaint => (
                <div key={complaint.id} className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">{complaint.subject}</h6>
                      {getStatusBadge(complaint.status)}
                    </div>
                    <div className="card-body">
                      <p className="mb-3">{complaint.description}</p>
                      {complaint.bookingId && (
                        <p className="text-muted small mb-2">
                          Related Booking ID: #{complaint.bookingId}
                        </p>
                      )}
                      {complaint.adminResponse && (
                        <div className="alert alert-info mt-3">
                          <strong>Admin Response:</strong>
                          <p className="mb-0 mt-2">{complaint.adminResponse}</p>
                          {complaint.resolvedAt && (
                            <small className="text-muted">
                              Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
                            </small>
                          )}
                        </div>
                      )}
                      <small className="text-muted">
                        Submitted on: {new Date(complaint.createdAt).toLocaleString()}
                      </small>
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
