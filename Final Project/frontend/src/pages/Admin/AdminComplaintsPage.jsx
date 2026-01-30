import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComplaints, resolveComplaint } from '../../services/api';

export default function AdminComplaintsPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getAllComplaints();
      setComplaints(response.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in as an admin.');
      } else if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      }
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = activeTab === 'ALL'
    ? complaints
    : complaints.filter(c => c.status === activeTab);

  const handleResolve = (complaint) => {
    setSelectedComplaint(complaint);
    setResolutionText('');
    setShowResolveModal(true);
  };

  const handleSubmitResolution = async () => {
    if (!resolutionText.trim()) {
      alert('Please provide a resolution response');
      return;
    }

    try {
      await resolveComplaint(selectedComplaint.id, { adminResponse: resolutionText });
      alert('Complaint resolved successfully!');
      setShowResolveModal(false);
      setSelectedComplaint(null);
      setResolutionText('');
      fetchComplaints();
    } catch (err) {
      console.error('Error resolving complaint:', err);
      let errorMessage = 'Failed to resolve complaint';
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
      <h1 className="fw-bold mb-4">📝 Manage Complaints</h1>

      {/* Status Tabs */}
      <ul className="nav nav-tabs mb-4">
        {['ALL', 'PENDING', 'RESOLVED', 'CLOSED'].map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab !== 'ALL' && (
                <span className="badge bg-secondary ms-2">
                  {complaints.filter(c => c.status === tab).length}
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
          <p className="mt-3">Loading complaints...</p>
        </div>
      ) : (
        <>
          {filteredComplaints.length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <p className="text-muted">No complaints found in this category.</p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredComplaints.map(complaint => (
                <div key={complaint.id} className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{complaint.subject}</h6>
                        <small className="text-muted">
                          By: {complaint.userName} ({complaint.userEmail})
                        </small>
                      </div>
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
                        <div className="alert alert-info">
                          <strong>Resolution:</strong>
                          <p className="mb-0 mt-2">{complaint.adminResponse}</p>
                          {complaint.resolvedAt && (
                            <small className="text-muted">
                              Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
                            </small>
                          )}
                        </div>
                      )}
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Submitted: {new Date(complaint.createdAt).toLocaleString()}
                        </small>
                        {complaint.status === 'PENDING' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleResolve(complaint)}
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Resolve Modal */}
      {showResolveModal && selectedComplaint && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resolve Complaint</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowResolveModal(false);
                  setSelectedComplaint(null);
                  setResolutionText('');
                }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Subject:</strong> {selectedComplaint.subject}
                </div>
                <div className="mb-3">
                  <strong>Description:</strong>
                  <p>{selectedComplaint.description}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Admin Response *</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="Enter your resolution response..."
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowResolveModal(false);
                    setSelectedComplaint(null);
                    setResolutionText('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={handleSubmitResolution}
                >
                  Resolve Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
