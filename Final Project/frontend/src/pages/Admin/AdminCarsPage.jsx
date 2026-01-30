import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVehicles, deleteVehicle } from '../../services/api';

export default function AdminCarsPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await getAllVehicles();
      setVehicles(response.data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in as an admin.');
      } else if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      }
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image path
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return '/vehicle-images/Accord.jpg';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.includes('/')) {
      return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }
    return `/vehicle-images/${imageUrl}`;
  };

  const filteredCars = vehicles.filter(vehicle => {
    const matchesSearch =
      (vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = async (vehicle) => {
    if (window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}? This action cannot be undone.`)) {
      try {
        await deleteVehicle(vehicle.id);
        setVehicles(vehicles.filter(v => v.id !== vehicle.id));
        alert('Vehicle deleted successfully');
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        alert(err.response?.data || 'Failed to delete vehicle');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">🚗 Manage Vehicles</h1>
      </div>

      {/* Search and Filter */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search vehicles by make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="DEACTIVATED">Deactivated</option>
              </select>
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
          <p className="mt-3">Loading vehicles...</p>
        </div>
      ) : (
        <>
          {/* Cars Grid */}
          <div className="row g-4">
            {filteredCars.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5">
                  <h3 className="text-muted">No vehicles found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              </div>
            ) : (
              filteredCars.map(vehicle => (
                <div key={vehicle.id} className="col-md-6 col-lg-4 col-xl-3">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="position-relative">
                      <img
                        src={getImagePath(vehicle.imageUrl)}
                        className="card-img-top"
                        alt={`${vehicle.make} ${vehicle.model}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/vehicle-images/Accord.jpg';
                        }}
                      />
                      <span className={`position-absolute top-0 end-0 badge m-2 ${vehicle.status === 'AVAILABLE' ? 'bg-success' :
                          vehicle.status === 'BOOKED' ? 'bg-info' :
                            vehicle.status === 'UNDER_MAINTENANCE' ? 'bg-warning text-dark' :
                              'bg-secondary'
                        }`}>
                        {vehicle.status === 'AVAILABLE' ? 'Available' :
                          vehicle.status === 'BOOKED' ? 'Booked' :
                            vehicle.status === 'UNDER_MAINTENANCE' ? 'Under Maintenance' :
                              vehicle.status === 'DEACTIVATED' ? 'Deactivated' : vehicle.status}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold mb-0">{vehicle.make} {vehicle.model}</h5>
                        <small className="text-muted">{vehicle.year}</small>
                      </div>
                      <p className="card-text text-muted small mb-2">
                        {vehicle.fuelType} • {vehicle.transmission} • {vehicle.seatingCapacity} seats
                      </p>
                      <p className="card-text text-primary fw-bold mb-3">₹{vehicle.pricePerDay}/day</p>
                      <p className="card-text text-muted small mb-2">
                        Vendor: {vehicle.vendorName || 'Unknown'}
                      </p>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary flex-grow-1"
                          onClick={() => handleViewVehicle(vehicle)}
                        >
                          ✏️ View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          onClick={() => handleDeleteVehicle(vehicle)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Vehicle Details Modal */}
      {showModal && selectedVehicle && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Vehicle Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <img
                      src={getImagePath(selectedVehicle.imageUrl)}
                      alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/vehicle-images/Accord.jpg';
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h4 className="mb-3">{selectedVehicle.make} {selectedVehicle.model}</h4>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th>Year:</th>
                          <td>{selectedVehicle.year}</td>
                        </tr>
                        <tr>
                          <th>Color:</th>
                          <td>{selectedVehicle.color || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>License Plate:</th>
                          <td>{selectedVehicle.licensePlate || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>VIN:</th>
                          <td>{selectedVehicle.vin || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Fuel Type:</th>
                          <td>{selectedVehicle.fuelType || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Transmission:</th>
                          <td>{selectedVehicle.transmission || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Seating Capacity:</th>
                          <td>{selectedVehicle.seatingCapacity || 'N/A'} seats</td>
                        </tr>
                        <tr>
                          <th>Price Per Day:</th>
                          <td className="text-primary fw-bold">₹{selectedVehicle.pricePerDay || '0'}</td>
                        </tr>
                        <tr>
                          <th>Status:</th>
                          <td>
                            <span className={`badge ${selectedVehicle.status === 'AVAILABLE' ? 'bg-success' :
                                selectedVehicle.status === 'BOOKED' ? 'bg-info' :
                                  selectedVehicle.status === 'UNDER_MAINTENANCE' ? 'bg-warning text-dark' :
                                    'bg-secondary'
                              }`}>
                              {selectedVehicle.status === 'AVAILABLE' ? 'Available' :
                                selectedVehicle.status === 'BOOKED' ? 'Booked' :
                                  selectedVehicle.status === 'UNDER_MAINTENANCE' ? 'Under Maintenance' :
                                    selectedVehicle.status === 'DEACTIVATED' ? 'Deactivated' : selectedVehicle.status}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th>Vendor:</th>
                          <td>{selectedVehicle.vendorName || 'Unknown'}</td>
                        </tr>
                        {selectedVehicle.description && (
                          <tr>
                            <th>Description:</th>
                            <td>{selectedVehicle.description}</td>
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
