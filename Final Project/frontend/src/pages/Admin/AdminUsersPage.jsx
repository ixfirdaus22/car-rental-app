import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../services/api';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in as an admin.');
      } else if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(userId);
      alert('User deleted successfully!');
      fetchUsers(); // Refresh the list
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

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <h1 className="fw-bold mb-4">👥 Manage Users</h1>

      {/* Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <p className="text-muted">No users found matching your search.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>#{user.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle p-2 me-2">
                                👤
                              </div>
                              <strong>{user.name || 'Unknown'}</strong>
                            </div>
                          </td>
                          <td>{user.email || 'N/A'}</td>
                          <td>{user.phoneNo || 'N/A'}</td>
                          <td>
                            <span className={`badge ${
                              user.role?.toUpperCase() === 'ADMIN' ? 'bg-danger' :
                              user.role?.toUpperCase() === 'VENDOR' ? 'bg-info' : 'bg-primary'
                            }`}>
                              {user.role || 'CUSTOMER'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleViewUser(user)}
                              >
                                View
                              </button>
                              {user.role?.toUpperCase() !== 'ADMIN' && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details - {selectedUser.name || 'Unknown'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-3">Personal Information</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th>User ID:</th>
                          <td><strong>#{selectedUser.id}</strong></td>
                        </tr>
                        <tr>
                          <th>Name:</th>
                          <td>{selectedUser.name || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{selectedUser.email || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Phone:</th>
                          <td>{selectedUser.phoneNo || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Gender:</th>
                          <td>{selectedUser.gender || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-3">Account Information</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th>Role:</th>
                          <td>
                            <span className={`badge ${
                              selectedUser.role?.toUpperCase() === 'ADMIN' ? 'bg-danger' :
                              selectedUser.role?.toUpperCase() === 'VENDOR' ? 'bg-info' : 'bg-primary'
                            }`}>
                              {selectedUser.role || 'CUSTOMER'}
                            </span>
                          </td>
                        </tr>
                        {selectedUser.licenseNo && (
                          <tr>
                            <th>License Number:</th>
                            <td>{selectedUser.licenseNo}</td>
                          </tr>
                        )}
                        {selectedUser.aadharNo && (
                          <tr>
                            <th>Aadhar Number:</th>
                            <td>{selectedUser.aadharNo}</td>
                          </tr>
                        )}
                        {(selectedUser.houseNo || selectedUser.buildingName || selectedUser.streetName || selectedUser.area) && (
                          <tr>
                            <th>Address:</th>
                            <td>
                              {[selectedUser.houseNo, selectedUser.buildingName, selectedUser.streetName, selectedUser.area]
                                .filter(Boolean)
                                .join(', ')}
                            </td>
                          </tr>
                        )}
                        {selectedUser.pincode && (
                          <tr>
                            <th>Pincode:</th>
                            <td>{selectedUser.pincode}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
