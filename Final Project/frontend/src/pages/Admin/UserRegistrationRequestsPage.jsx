import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingUsers, approveUser, rejectUser, deleteUser } from '../../services/api';

export default function UserRegistrationRequestsPage() {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await getPendingUsers();
      setPendingUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching pending users:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in as an admin.');
      } else if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      }
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this user registration?')) {
      return;
    }

    try {
      await approveUser(userId);
      alert('User approved successfully!');
      fetchPendingUsers(); // Refresh the list
    } catch (err) {
      console.error('Error approving user:', err);
      alert('Failed to approve user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this user registration? This action cannot be undone.')) {
      return;
    }

    try {
      await rejectUser(userId);
      alert('User registration rejected.');
      fetchPendingUsers(); // Refresh the list
    } catch (err) {
      console.error('Error rejecting user:', err);
      alert('Failed to reject user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? This action cannot be undone and will remove all associated data.`)) {
      return;
    }

    try {
      await deleteUser(userId);
      alert('User deleted successfully!');
      fetchPendingUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      console.error('Error response:', err.response);
      
      // Extract error message from response
      let errorMessage = 'Unknown error occurred';
      
      if (err.response) {
        // Backend returns error message as string in response.data
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } 
        // Handle JSON object response
        else if (err.response.data && typeof err.response.data === 'object') {
          errorMessage = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
        }
        // Fallback to status text
        else if (err.response.statusText) {
          errorMessage = err.response.statusText;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert('Failed to delete user:\n' + errorMessage);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">📝 User Registration Requests</h1>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading registration requests...</p>
        </div>
      ) : (
        <>
          {pendingUsers.length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <h4 className="text-muted">No Pending Registrations</h4>
                <p className="text-muted">All user registrations have been processed.</p>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {pendingUsers.map(user => (
                <div key={user.id} className="col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-warning text-dark">
                      <h6 className="mb-0">Pending Registration - User #{user.id}</h6>
                    </div>
                    <div className="card-body">
                      <table className="table table-borderless table-sm mb-0">
                        <tbody>
                          <tr>
                            <th>Name:</th>
                            <td>{user.name || 'N/A'}</td>
                          </tr>
                          <tr>
                            <th>Email:</th>
                            <td>{user.email || 'N/A'}</td>
                          </tr>
                          <tr>
                            <th>Phone:</th>
                            <td>{user.phoneNo || 'N/A'}</td>
                          </tr>
                          <tr>
                            <th>Gender:</th>
                            <td>{user.gender || 'N/A'}</td>
                          </tr>
                          <tr>
                            <th>Role:</th>
                            <td>
                              <span className={`badge ${
                                user.role?.toUpperCase() === 'ADMIN' ? 'bg-danger' :
                                user.role?.toUpperCase() === 'VENDOR' ? 'bg-info' : 'bg-primary'
                              }`}>
                                {user.role || 'CUSTOMER'}
                              </span>
                            </td>
                          </tr>
                          {user.licenseNo && (
                            <tr>
                              <th>License No:</th>
                              <td>{user.licenseNo}</td>
                            </tr>
                          )}
                          {user.aadharNo && (
                            <tr>
                              <th>Aadhar No:</th>
                              <td>{user.aadharNo}</td>
                            </tr>
                          )}
                          {(user.houseNo || user.buildingName || user.streetName || user.area) && (
                            <tr>
                              <th>Address:</th>
                              <td>
                                {[user.houseNo, user.buildingName, user.streetName, user.area]
                                  .filter(Boolean)
                                  .join(', ')}
                              </td>
                            </tr>
                          )}
                          {user.pincode && (
                            <tr>
                              <th>Pincode:</th>
                              <td>{user.pincode}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="card-footer bg-white">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success flex-grow-1"
                          onClick={() => handleApprove(user.id)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-warning flex-grow-1"
                          onClick={() => handleReject(user.id)}
                        >
                          ✕ Reject
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(user.id, user.name || user.email)}
                        >
                          Delete
                        </button>
                      </div>
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
