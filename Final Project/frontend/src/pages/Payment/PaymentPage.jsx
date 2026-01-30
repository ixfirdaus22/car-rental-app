import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { createBooking, createPayment } from '../../services/api';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const car = location.state?.car || location.state?.vehicle || null;

  // Helper function to get image path
  const getImagePath = (imageUrl, make, model) => {
    // If imageUrl is provided and is a full URL, use it
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return imageUrl;
    }
    
    // If imageUrl is provided (just filename), use it
    if (imageUrl) {
      // Remove any leading slashes
      const cleanUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
      return `/vehicle-images/${cleanUrl}`;
    }
    
    // Fallback: Try to match based on make/model
    const makeModel = `${make || ''}${model || ''}`.toLowerCase().replace(/\s+/g, '');
    const imageMap = {
      'hondaaccord': '/vehicle-images/Accord.jpg',
      'marutiswift': '/vehicle-images/Swift.jpg',
      'mahindraxuv500': '/vehicle-images/XUV500.jpg',
      'mahindraxuv': '/vehicle-images/XUV.jpg',
      'toyotafortuner': '/vehicle-images/Fortuner.jpg',
      'hyundaicreta': '/vehicle-images/creta.jpg',
      'tatanexon': '/vehicle-images/Nexon.jpg',
      'marutimaruti': '/vehicle-images/Maruti.jpg'
    };
    
    // Try to find matching image
    for (const [key, path] of Object.entries(imageMap)) {
      if (makeModel.includes(key)) {
        return path;
      }
    }
    
    // Final fallback
    return '/vehicle-images/Accord.jpg';
  };
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [returnLocation, setReturnLocation] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!car || !user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>Invalid booking session</h5>
          <p>Please select a car and log in before proceeding to payment.</p>
          <a href="/cars" className="btn btn-primary">Back to Cars</a>
        </div>
      </div>
    );
  }

  const calculateDays = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    return Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();
  const pricePerDay = car.basePricePerDay || car.pricePerDay || 0;
  const totalCost = days > 0 ? days * pricePerDay : 0;

  const validatePayment = () => {
    setError('');

    if (!pickupDate || !dropoffDate) {
      setError('Please select pick-up and drop-off dates');
      return false;
    }

    if (days <= 0) {
      setError('Drop-off date must be after pick-up date');
      return false;
    }

    if (!upiId.trim()) {
      setError('Please enter your UPI ID');
      return false;
    }

    // Basic UPI ID validation (format: name@upi)
    const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiPattern.test(upiId.trim())) {
      setError('Please enter a valid UPI ID (e.g., yourname@paytm)');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    if (!pickupLocation.trim() || !returnLocation.trim()) {
      setError('Please enter pickup and return locations');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create booking first
      const bookingData = {
        vehicleId: car.id || car.vehicleId || car.carId,
        pickupDate: pickupDate,
        returnDate: dropoffDate,
        pickupLocation: pickupLocation,
        returnLocation: returnLocation
      };

      const bookingResponse = await createBooking(bookingData);
      const bookingId = bookingResponse.data.id;
      
      // Step 2: Create payment
      const paymentData = {
        bookingId: bookingId,
        paymentMethod: 'upi',
        transactionId: `UPI-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      await createPayment(paymentData);
      
      // Success
      alert('Payment successful! Your booking has been confirmed.');
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to process payment. Please try again.');
      console.error('Error processing payment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 fw-bold">Complete Your Booking</h1>

      <div className="row g-4">
        {/* Left Column - Booking Details */}
        <div className="col-lg-7">
          {/* Car Summary with Image */}
          <div className="card mb-4 shadow-lg">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">🚗 Booking Summary</h5>
            </div>
            <div className="card-body">
              {/* Large Car Image */}
              <div className="mb-3">
                <img
                  src={car.img || getImagePath(car.imageUrl, car.make || car.brand, car.model) || '/vehicle-images/Accord.jpg'}
                  alt={`${car.brand || car.make || 'Car'} ${car.model || ''}`}
                  className="img-fluid rounded shadow-sm"
                  style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                  onError={(e) => {
                    // Try fallback based on make/model
                    const fallback = getImagePath(null, car.make || car.brand, car.model);
                    e.target.src = fallback;
                  }}
                />
              </div>

              {/* Car Details */}
              <div className="row g-3">
                <div className="col-md-8">
                  <h4 className="mb-2">{car.brand || car.make || 'Car'} {car.model || ''}</h4>
                  <p className="text-muted mb-2">
                    {car.type || `${car.fuelType || car.fuel || ''} ${car.transmission || ''}`} • {car.seats || car.seatingCapacity || 0} seats • {car.fuel || car.fuelType || ''}
                  </p>
                  <p className="mb-0">
                    <strong className="text-primary fs-5">₹{pricePerDay}</strong> <span className="text-muted">/day</span>
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <div className="badge bg-info text-dark p-2">
                    <small>Auto-assigned<br />on booking</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates Selection */}
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Rental Dates & Locations</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Pick-up Date *</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Drop-off Date *</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Pick-up Location *</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter pickup location"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Return Location *</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    placeholder="Enter return location"
                    required
                  />
                </div>
              </div>
              {days > 0 && (
                <div className="alert alert-info mt-3 mb-0">
                  <strong>Total Duration:</strong> {days} day{days !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* UPI Payment */}
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">📱 UPI Payment</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">UPI ID</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="yourname@paytm or yourname@ybl"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <small className="text-muted">Enter your UPI ID (e.g., yourname@paytm, yourname@ybl, yourname@phonepe)</small>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
        </div>

        {/* Right Column - Price Summary */}
        <div className="col-lg-5">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Price Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Car: {car.brand || car.make} {car.model}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Daily Rate:</span>
                <strong>₹{car.basePricePerDay || car.pricePerDay || 0}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Duration:</span>
                <strong>{days} day{days !== 1 ? 's' : ''}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal:</span>
                <strong>₹{(pricePerDay * days).toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Insurance:</span>
                <strong>₹0 (Included)</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Taxes & Fees:</span>
                <strong>₹{Math.round(totalCost * 0.1).toLocaleString()}</strong>
              </div>
              <hr className="my-3" />
              <div className="d-flex justify-content-between mb-4">
                <h5 className="mb-0">Total Amount:</h5>
                <h4 className="text-primary mb-0">₹{Math.round(totalCost * 1.1).toLocaleString()}</h4>
              </div>

              {/* Terms */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  defaultChecked
                />
                <label className="form-check-label small" htmlFor="terms">
                  I agree to the terms and conditions
                </label>
              </div>

              {/* Pay Button */}
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handlePayment}
                disabled={loading || days <= 0}
              >
                {loading ? '⏳ Processing...' : `📱 Pay via UPI ₹${Math.round(totalCost * 1.1).toLocaleString()}`}
              </button>

              {/* Info */}
              <div className="alert alert-info mt-3 mb-0 small">
                <strong>Note:</strong> Payment will be processed via UPI. Make sure your UPI ID is correct.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
