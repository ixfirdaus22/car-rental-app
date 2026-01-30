import { useState, useEffect } from 'react'
import { getVendorVehicles, addVehicle, updateVehicle, deleteVehicle, updateVehicleStatus } from '../../services/api'

export default function VendorCars() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    vin: '',
    pricePerDay: '',
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    seatingCapacity: 5,
    description: '',
    imageUrl: ''
  })

  // Helper function to get image path
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return null
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    // If it's just a filename, prepend the vehicle-images path
    if (imageUrl.includes('/')) {
      return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
    }
    // Just filename, add the folder path
    return `/vehicle-images/${imageUrl}`
  }

  // Fetch vehicles from backend
  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getVendorVehicles()
      setVehicles(response.data || [])
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied. Please make sure you are logged in as a vendor and try logging out and back in.')
      } else if (err.response?.status === 401) {
        setError('Please log in again. Your session may have expired.')
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch vehicles')
      }
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'seatingCapacity' || name === 'pricePerDay' 
        ? (value === '' ? '' : Number(value))
        : value
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Extract just the filename
      const fileName = file.name
      setFormData(prev => ({ ...prev, imageUrl: fileName }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddVehicle = async (e) => {
    e.preventDefault()
    try {
      await addVehicle(formData)
      setShowAddModal(false)
      resetForm()
      fetchVehicles()
      alert('Vehicle added successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add vehicle')
      console.error('Error adding vehicle:', err)
    }
  }

  const handleEditVehicle = async (e) => {
    e.preventDefault()
    try {
      await updateVehicle(selectedVehicle.id, formData)
      setShowEditModal(false)
      resetForm()
      setSelectedVehicle(null)
      fetchVehicles()
      alert('Vehicle updated successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update vehicle')
      console.error('Error updating vehicle:', err)
    }
  }

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return
    }
    try {
      await deleteVehicle(id)
      fetchVehicles()
      alert('Vehicle deleted successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle')
      console.error('Error deleting vehicle:', err)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateVehicleStatus(selectedVehicle.id, { status: newStatus })
      setShowStatusModal(false)
      setSelectedVehicle(null)
      fetchVehicles()
      alert('Vehicle status updated successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
      console.error('Error updating status:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      licensePlate: '',
      vin: '',
      pricePerDay: '',
      fuelType: 'PETROL',
      transmission: 'MANUAL',
      seatingCapacity: 5,
      description: '',
      imageUrl: ''
    })
    setImagePreview(null)
  }

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle)
    setFormData({
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year || new Date().getFullYear(),
      color: vehicle.color || '',
      licensePlate: vehicle.licensePlate || '',
      vin: vehicle.vin || '',
      pricePerDay: vehicle.pricePerDay || '',
      fuelType: vehicle.fuelType || 'PETROL',
      transmission: vehicle.transmission || 'MANUAL',
      seatingCapacity: vehicle.seatingCapacity || 5,
      description: vehicle.description || '',
      imageUrl: vehicle.imageUrl || ''
    })
    // Set image preview for existing image
    if (vehicle.imageUrl) {
      setImagePreview(getImagePath(vehicle.imageUrl))
    } else {
      setImagePreview(null)
    }
    setShowEditModal(true)
  }

  const openStatusModal = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowStatusModal(true)
  }

  const filteredVehicles = filterStatus === 'All' 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.status === filterStatus)

  const getStatusBadge = (status) => {
    switch(status) {
      case 'AVAILABLE':
        return <span className="badge bg-success">Available</span>
      case 'BOOKED':
        return <span className="badge bg-info">Booked</span>
      case 'UNDER_MAINTENANCE':
        return <span className="badge bg-warning text-dark">Under Maintenance</span>
      case 'DEACTIVATED':
        return <span className="badge bg-secondary">Deactivated</span>
      default:
        return <span className="badge bg-secondary">{status}</span>
    }
  }

  const getStatusDisplayName = (status) => {
    const statusMap = {
      'AVAILABLE': 'Available',
      'BOOKED': 'Booked',
      'UNDER_MAINTENANCE': 'Under Maintenance',
      'DEACTIVATED': 'Deactivated'
    }
    return statusMap[status] || status
  }

  const availableCount = vehicles.filter(v => v.status === 'AVAILABLE').length
  const totalEarnings = vehicles.reduce((sum, v) => sum + (v.pricePerDay || 0), 0)

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading vehicles...</p>
      </div>
    )
  }

  if (error && vehicles.length === 0) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchVehicles}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>My Vehicles</h4>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
        >
          ➕ Add New Car
        </button>
      </div>

      {/* Stats Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="vendor-stat-card">
            <div className="stat-icon primary">🚗</div>
            <div className="stat-content">
              <h6 className="stat-label">Total Cars</h6>
              <h3 className="stat-value">{vehicles.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="vendor-stat-card">
            <div className="stat-icon success">✓</div>
            <div className="stat-content">
              <h6 className="stat-label">Available</h6>
              <h3 className="stat-value">{availableCount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="vendor-stat-card">
            <div className="stat-icon info">📅</div>
            <div className="stat-content">
              <h6 className="stat-label">Total Bookings</h6>
              <h3 className="stat-value">-</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="vendor-stat-card">
            <div className="stat-icon accent">💰</div>
            <div className="stat-content">
              <h6 className="stat-label">Est. Revenue</h6>
              <h3 className="stat-value">₹{(totalEarnings / 100000).toFixed(1)}L</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="vendor-filters mb-4">
        <div className="filter-group">
          {['All', 'AVAILABLE', 'BOOKED', 'UNDER_MAINTENANCE', 'DEACTIVATED'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'All' ? 'All' : getStatusDisplayName(status)}
              <span className="filter-count">
                {status === 'All' 
                  ? vehicles.length 
                  : vehicles.filter(v => v.status === status).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="row g-4 mb-4">
        {filteredVehicles.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <p className="mb-0">No vehicles found. Add your first vehicle to get started!</p>
            </div>
          </div>
        ) : (
          filteredVehicles.map(vehicle => (
            <div key={vehicle.id} className="col-md-6 col-lg-4">
              <div className="vendor-car-card">
                <div className="car-image">
                  {vehicle.imageUrl ? (
                    <img 
                      src={getImagePath(vehicle.imageUrl)} 
                      alt={vehicle.make} 
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                  ) : null}
                  {!vehicle.imageUrl && <span className="car-emoji">🚗</span>}
                  {getStatusBadge(vehicle.status)}
                </div>

                <div className="car-card-body">
                  <h6 className="car-name">{vehicle.make} {vehicle.model}</h6>
                  <small className="text-muted">{vehicle.year}</small>

                  <div className="car-specs">
                    <div className="spec">
                      <span className="spec-icon">⛽</span>
                      <span className="spec-text">{vehicle.fuelType}</span>
                    </div>
                    <div className="spec">
                      <span className="spec-icon">⚙️</span>
                      <span className="spec-text">{vehicle.transmission}</span>
                    </div>
                    <div className="spec">
                      <span className="spec-icon">👥</span>
                      <span className="spec-text">{vehicle.seatingCapacity} Seats</span>
                    </div>
                  </div>

                  <div className="car-price">
                    <span className="price-label">Daily Rate</span>
                    <span className="price-value">₹{vehicle.pricePerDay}</span>
                  </div>
                </div>

                <div className="car-card-footer">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openEditModal(vehicle)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vehicles Table */}
      <div className="vendor-card">
        <div className="card-header">
          <h5 className="mb-0">Detailed Vehicle Information</h5>
        </div>
        <div className="table-responsive">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>License Plate</th>
                <th>Fuel Type</th>
                <th>Transmission</th>
                <th>Daily Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>
                    <strong>{vehicle.make} {vehicle.model}</strong>
                    <br/>
                    <small className="text-muted">{vehicle.year} - {vehicle.color}</small>
                  </td>
                  <td>{vehicle.licensePlate}</td>
                  <td>{vehicle.fuelType}</td>
                  <td>{vehicle.transmission}</td>
                  <td><strong>₹{vehicle.pricePerDay}</strong></td>
                  <td>{getStatusBadge(vehicle.status)}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        View
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => openEditModal(vehicle)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-outline-warning"
                        onClick={() => openStatusModal(vehicle)}
                      >
                        Status
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Details Modal */}
      {selectedVehicle && !showEditModal && !showStatusModal && (
        <div className="vendor-modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="vendor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5>{selectedVehicle.make} {selectedVehicle.model} - Details</h5>
              <button 
                className="btn-close"
                onClick={() => setSelectedVehicle(null)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h6 className="section-title">Basic Information</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Make:</span>
                    <span className="value">{selectedVehicle.make}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Model:</span>
                    <span className="value">{selectedVehicle.model}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Year:</span>
                    <span className="value">{selectedVehicle.year}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Color:</span>
                    <span className="value">{selectedVehicle.color}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">License Plate:</span>
                    <span className="value">{selectedVehicle.licensePlate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">VIN:</span>
                    <span className="value">{selectedVehicle.vin}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6 className="section-title">Vehicle Specifications</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Fuel Type:</span>
                    <span className="value">{selectedVehicle.fuelType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Transmission:</span>
                    <span className="value">{selectedVehicle.transmission}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Seating Capacity:</span>
                    <span className="value">{selectedVehicle.seatingCapacity} Seats</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Daily Rate:</span>
                    <strong className="text-success">₹{selectedVehicle.pricePerDay}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    {getStatusBadge(selectedVehicle.status)}
                  </div>
                </div>
              </div>

              {selectedVehicle.description && (
                <div className="detail-section">
                  <h6 className="section-title">Description</h6>
                  <p>{selectedVehicle.description}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedVehicle(null)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => openEditModal(selectedVehicle)}
              >
                Edit Vehicle
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => openStatusModal(selectedVehicle)}
              >
                Change Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="vendor-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="vendor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Add New Vehicle</h5>
              <button 
                className="btn-close"
                onClick={() => setShowAddModal(false)}
              ></button>
            </div>
            <form onSubmit={handleAddVehicle}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Make *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Model *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Year *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Color *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">License Plate *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">VIN *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price Per Day (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fuel Type *</label>
                    <select
                      className="form-select"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="PETROL">Petrol</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="ELECTRIC">Electric</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Transmission *</label>
                    <select
                      className="form-select"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="MANUAL">Manual</option>
                      <option value="AUTOMATIC">Automatic</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Seating Capacity *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Vehicle Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {showEditModal && selectedVehicle && (
        <div className="vendor-modal-overlay" onClick={() => {
          setShowEditModal(false)
          setSelectedVehicle(null)
          resetForm()
        }}>
          <div className="vendor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Edit Vehicle</h5>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedVehicle(null)
                  resetForm()
                }}
              ></button>
            </div>
            <form onSubmit={handleEditVehicle}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Make *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Model *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Year *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Color *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">License Plate *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">VIN *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price Per Day (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fuel Type *</label>
                    <select
                      className="form-select"
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="PETROL">Petrol</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="ELECTRIC">Electric</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Transmission *</label>
                    <select
                      className="form-select"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="MANUAL">Manual</option>
                      <option value="AUTOMATIC">Automatic</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Seating Capacity *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Vehicle Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedVehicle(null)
                    resetForm()
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedVehicle && (
        <div className="vendor-modal-overlay" onClick={() => {
          setShowStatusModal(false)
          setSelectedVehicle(null)
        }}>
          <div className="vendor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Update Vehicle Status</h5>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedVehicle(null)
                }}
              ></button>
            </div>
            <div className="modal-body">
              <p>Current Status: {getStatusBadge(selectedVehicle.status)}</p>
              <p className="mb-3">Select new status:</p>
              <div className="d-grid gap-2">
                {['AVAILABLE', 'BOOKED', 'UNDER_MAINTENANCE', 'DEACTIVATED'].map(status => (
                  <button
                    key={status}
                    className={`btn ${selectedVehicle.status === status ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={selectedVehicle.status === status}
                  >
                    {getStatusDisplayName(status)}
                    {selectedVehicle.status === status && ' (Current)'}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedVehicle(null)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
