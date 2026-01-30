import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { getVehicleById, createReview, getReviewsByVehicleId } from '../../services/api';

export default function CarDetailsPage() {
  const { carId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  // Fetch vehicle from backend
  useEffect(() => {
    // First, check if we have data from location state (passed from CarCard)
    if (location.state?.car || location.state?.vehicle) {
      const carFromState = location.state.car || location.state.vehicle;
      // Set as vehicle so it can be used
      setVehicle(carFromState);
      setLoading(false);
      // Still try to fetch from API to get latest data, but don't block on it
      if (carId) {
        fetchVehicle().catch(() => {
          // If API fails, we already have data from state, so just log
          console.log('API fetch failed, using data from state');
        });
      }
    } else if (carId) {
      // No state data, fetch from API
      fetchVehicle();
    } else {
      // No carId and no state, show error
      setLoading(false);
    }
  }, [carId]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      console.log('Fetching vehicle with ID:', carId);
      const response = await getVehicleById(carId);
      console.log('Vehicle response:', response);
      if (response && response.data) {
        setVehicle(response.data);
        console.log('Vehicle data set:', response.data);
      } else {
        console.error('No vehicle data received');
        setVehicle(null);
      }
    } catch (err) {
      console.error('Error fetching vehicle:', err);
      console.error('Error details:', err.response?.data || err.message);
      setVehicle(null);
      // Don't show alert immediately, let the component handle it
    } finally {
      setLoading(false);
    }
  };

  // Car database for when car is not passed through state
  const CAR_DATABASE = {
    1: {
      carId: 1,
      brand: 'Maruti',
      model: 'Swift',
      type: 'Hatchback',
      seats: 5,
      fuel: 'Petrol',
      transmission: 'Manual',
      mileage: '20 kmpl',
      basePricePerDay: 1500,
      img: '/Swift.jpg',
      rating: 4.5,
      totalReviews: 24,
      description: 'The Maruti Swift is a reliable and fuel-efficient hatchback perfect for city driving and weekend getaways. With its compact size, excellent mileage, and user-friendly features, it\'s ideal for budget-conscious travelers.',
      features: [
        'Compact and easy to maneuver',
        'Excellent fuel efficiency (20 kmpl)',
        'Air conditioning',
        'Power steering',
        'Power windows',
        'USB connectivity',
        'ABS (Anti-lock braking system)',
        'Free 24/7 roadside assistance'
      ],
      images: [
        '/Swift.jpg',
        'https://images.unsplash.com/photo-1609708536965-59d5e2f58f68?auto=format&fit=crop&w=600&q=60',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=60'
      ]
    },
    2: {
      carId: 2,
      brand: 'Honda',
      model: 'Accord',
      type: 'Sedan',
      seats: 5,
      fuel: 'Petrol',
      transmission: 'Automatic',
      mileage: '16 kmpl',
      basePricePerDay: 3500,
      img: '/Accord.jpg',
      rating: 4.7,
      totalReviews: 18,
      description: 'The Honda Accord is a premium sedan with superior comfort and performance. Ideal for business travelers and long-distance journeys.',
      features: [
        'Automatic transmission',
        'Cruise control',
        'Sunroof',
        'Premium sound system',
        'Power steering',
        'Climate control',
        'Leather seats',
        'Navigation system'
      ],
      images: [
        '/Accord.jpg',
        'https://images.unsplash.com/photo-1606611013016-969c19d24e6f?auto=format&fit=crop&w=600&q=60',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=60'
      ]
    },
    3: {
      carId: 3,
      brand: 'Mahindra',
      model: 'XUV500',
      type: 'SUV',
      seats: 7,
      fuel: 'Diesel',
      transmission: 'Automatic',
      mileage: '15 kmpl',
      basePricePerDay: 4500,
      img: '/XUV500.jpg',
      rating: 4.6,
      totalReviews: 32,
      description: 'The Mahindra XUV500 is a spacious 7-seater SUV perfect for family trips and group travel. Premium comfort with excellent off-road capabilities.',
      features: [
        'Spacious 7-seater layout',
        'Automatic transmission',
        'All-wheel drive',
        'Power windows',
        'Alloy wheels',
        'Panoramic sunroof',
        'Touchscreen infotainment',
        'Cruise control'
      ],
      images: [
        '/XUV500.jpg',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=60',
        'https://images.unsplash.com/photo-1609708536965-59d5e2f58f68?auto=format&fit=crop&w=600&q=60'
      ]
    }
  };

  // Get car from state (passed from CarCard) or from database, then merge with database details
  const getCarDetails = () => {
    let selectedCar = location.state?.car || CAR_DATABASE[carId];
    
    // If car was passed from CarCard, merge it with database details
    if (location.state?.car && CAR_DATABASE[carId]) {
      selectedCar = { ...CAR_DATABASE[carId], ...location.state.car };
    }
    
    // If still no car, use database or default
    if (!selectedCar) {
      selectedCar = CAR_DATABASE[carId] || {
        carId: carId || 1,
        brand: 'Maruti',
        model: 'Swift',
        type: 'Hatchback',
        seats: 5,
        fuel: 'Petrol',
        transmission: 'Manual',
        mileage: '20 kmpl',
        basePricePerDay: 1500,
        img: '/Swift.jpg',
        rating: 4.5,
        totalReviews: 24,
        description: 'The Maruti Swift is a reliable and fuel-efficient hatchback perfect for city driving and weekend getaways. With its compact size, excellent mileage, and user-friendly features, it\'s ideal for budget-conscious travelers.',
        features: [
          'Compact and easy to maneuver',
          'Excellent fuel efficiency (20 kmpl)',
          'Air conditioning',
          'Power steering',
          'Power windows',
          'USB connectivity',
          'ABS (Anti-lock braking system)',
          'Free 24/7 roadside assistance'
        ],
        images: [
          '/Swift.jpg',
          'https://images.unsplash.com/photo-1609708536965-59d5e2f58f68?auto=format&fit=crop&w=600&q=60',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=60'
        ],
        availableDates: [
          { date: '2025-12-05', available: true },
          { date: '2025-12-06', available: true },
          { date: '2025-12-07', available: false },
          { date: '2025-12-08', available: true },
          { date: '2025-12-09', available: true },
          { date: '2025-12-10', available: true },
          { date: '2025-12-11', available: false },
          { date: '2025-12-12', available: true }
        ]
      };
    }

    // Ensure all required properties exist
    return {
      ...selectedCar,
      features: selectedCar.features || [],
      images: selectedCar.images || [selectedCar.img, selectedCar.img, selectedCar.img],
      availableDates: selectedCar.availableDates || [
        { date: '2025-12-05', available: true },
        { date: '2025-12-06', available: true },
        { date: '2025-12-07', available: false },
        { date: '2025-12-08', available: true },
        { date: '2025-12-09', available: true },
        { date: '2025-12-10', available: true },
        { date: '2025-12-11', available: false },
        { date: '2025-12-12', available: true }
      ]
    };
  };

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

  // Use vehicle from backend if available, otherwise use state or fallback
  // Note: vehicle can be from API or from location.state
  const car = vehicle ? {
    id: vehicle.id,
    carId: vehicle.id,
    brand: vehicle.make,
    make: vehicle.make,
    model: vehicle.model,
    type: `${vehicle.fuelType} ${vehicle.transmission}`,
    seats: vehicle.seatingCapacity,
    seatingCapacity: vehicle.seatingCapacity,
    fuel: vehicle.fuelType,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    mileage: 'N/A',
    basePricePerDay: vehicle.pricePerDay,
    pricePerDay: vehicle.pricePerDay,
    img: getImagePath(vehicle.imageUrl, vehicle.make, vehicle.model),
    imageUrl: vehicle.imageUrl,
    year: vehicle.year,
    color: vehicle.color,
    rating: 4.5,
    totalReviews: 24,
    description: vehicle.description || 'No description available',
    features: [
      `${vehicle.fuelType} engine`,
      `${vehicle.transmission} transmission`,
      `${vehicle.seatingCapacity} seats`,
      'Air conditioning',
      'Power steering',
      'Power windows'
    ],
    images: [
      getImagePath(vehicle.imageUrl, vehicle.make, vehicle.model),
      getImagePath(vehicle.imageUrl, vehicle.make, vehicle.model), // Use same image for thumbnails
      getImagePath(vehicle.imageUrl, vehicle.make, vehicle.model)
    ],
    availableDates: [
      { date: new Date().toISOString().split('T')[0], available: true },
      { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], available: true },
      { date: new Date(Date.now() + 172800000).toISOString().split('T')[0], available: true }
    ]
  } : getCarDetails();

  // Reviews from backend
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch reviews when vehicle is loaded
  useEffect(() => {
    if (vehicle?.id || carId) {
      fetchReviews();
    }
  }, [vehicle?.id, carId]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const vehicleId = vehicle?.id || carId;
      if (vehicleId) {
        const response = await getReviewsByVehicleId(parseInt(vehicleId));
        setReviews(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddReview = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newReview.comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    const vehicleId = vehicle?.id || carId;
    if (!vehicleId) {
      alert('Vehicle information not available');
      return;
    }

    try {
      await createReview({
        vehicleId: parseInt(vehicleId),
        rating: newReview.rating,
        comment: newReview.comment
      });
      alert('Review submitted successfully! It will be visible after admin approval.');
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      // Refresh reviews (will only show approved ones)
      fetchReviews();
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

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!vehicle && !car) {
      alert('Vehicle information not available. Please try again.');
      return;
    }
    // Use vehicle from backend if available, otherwise use car from state/fallback
    const vehicleData = vehicle || car;
    navigate('/payment', { state: { car: vehicleData, vehicle: vehicleData, bookingType: 'new' } });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className="text-warning">
        {i < Math.floor(rating) ? '★' : '☆'}
      </span>
    ));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading vehicle details...</p>
        <p className="text-muted small">Vehicle ID: {carId}</p>
      </div>
    );
  }

  // Show error only if we have no data at all
  if (!loading && !vehicle && !car) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>Vehicle not found</h5>
          <p>The vehicle with ID <strong>{carId}</strong> could not be loaded.</p>
          <p className="text-muted small">This might be due to:</p>
          <ul className="text-start d-inline-block">
            <li>Vehicle does not exist</li>
            <li>Authentication required</li>
            <li>Network error</li>
          </ul>
          <button onClick={() => navigate('/cars')} className="btn btn-primary mt-3">Back to Cars</button>
        </div>
      </div>
    );
  }

  // Debug info (remove in production)
  console.log('CarDetailsPage render:', {
    carId,
    hasVehicle: !!vehicle,
    hasCar: !!car,
    locationState: location.state,
    carData: car
  });

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
          <li className="breadcrumb-item"><a href="/cars" className="text-decoration-none">Cars</a></li>
          <li className="breadcrumb-item active">{car?.brand || car?.make || 'Car'} {car?.model || ''}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Left Column - Images and Info */}
        <div className="col-lg-7">
          {/* Main Image */}
          <div className="mb-4">
            <img
              src={car?.img || getImagePath(car?.imageUrl, car?.make || car?.brand, car?.model) || '/vehicle-images/Accord.jpg'}
              alt={`${car?.brand || car?.make || 'Car'} ${car?.model || ''}`}
              className="img-fluid rounded shadow"
              style={{ height: '400px', objectFit: 'cover', width: '100%' }}
              onError={(e) => {
                // Try fallback based on make/model
                const fallback = getImagePath(null, car?.make || car?.brand, car?.model);
                e.target.src = fallback;
              }}
            />
          </div>

          {/* Thumbnail Images */}
          <div className="row g-2 mb-4">
            {(car?.images || [car?.img || '/vehicle-images/Accord.jpg']).map((image, index) => (
              <div key={index} className="col-4">
                <img
                  src={image}
                  alt={`${car?.brand || car?.make || 'Car'} ${car?.model || ''} - ${index + 1}`}
                  className="img-fluid rounded"
                  style={{ height: '100px', objectFit: 'cover', width: '100%', cursor: 'pointer' }}
                  onError={(e) => {
                    // Try fallback based on make/model
                    const fallback = getImagePath(null, car?.make || car?.brand, car?.model);
                    e.target.src = fallback;
                  }}
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">About this car</h5>
            </div>
            <div className="card-body">
              <p className="mb-3">{car?.description || 'No description available'}</p>
              <h6 className="fw-bold mb-2">Key Features:</h6>
              <ul className="list-unstyled">
                {(car?.features || []).map((feature, index) => (
                  <li key={index} className="mb-2">
                    <span className="badge bg-light text-dark me-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Available Dates */}
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Available Dates</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                {(car?.availableDates && car.availableDates.length > 0) ? (
                  (car.availableDates || []).map((dateObj, index) => (
                    <div key={index} className="col-6 col-md-4">
                      <div className={`p-2 text-center rounded ${dateObj.available ? 'bg-light' : 'bg-danger bg-opacity-10'}`}>
                        <small className="d-block">{new Date(dateObj.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small>
                        <strong className={dateObj.available ? 'text-success' : 'text-danger'}>
                          {dateObj.available ? '✓ Available' : '✗ Booked'}
                        </strong>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <p className="text-muted text-center mb-0">Availability dates not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Info & Reviews */}
        <div className="col-lg-5">
          {/* Car Header */}
          <div className="card mb-4 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-2">{car?.brand || car?.make || 'Car'} {car?.model || ''}</h3>
              <p className="text-muted mb-3">{car?.type || `${car?.fuelType || car?.fuel || ''} ${car?.transmission || ''}`} • {car?.seats || car?.seatingCapacity || 0} seats • {car?.fuel || car?.fuelType || ''}</p>

              {/* Rating */}
              <div className="d-flex align-items-center mb-3">
                <span className="me-2">{renderStars(car.rating || 0)}</span>
                <strong>{car.rating || 0}</strong>
                <span className="text-muted ms-2">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
              </div>

              <hr />

              {/* Specs Grid */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <small className="text-muted">Transmission</small>
                  <p className="mb-0"><strong>{car.transmission}</strong></p>
                </div>
                <div className="col-6">
                  <small className="text-muted">Mileage</small>
                  <p className="mb-0"><strong>{car.mileage}</strong></p>
                </div>
              </div>

              <hr />

              {/* Price & Booking */}
              <div className="mb-3">
                <h4 className="text-primary mb-2">₹{car?.basePricePerDay || car?.pricePerDay || 0} <small className="text-muted fs-6">/day</small></h4>
                <small className="text-muted d-block mb-3">Includes insurance and roadside assistance</small>
              </div>

              {/* Buttons */}
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleBooking}
                >
                  🚗 Book Now
                </button>
                {user && (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    ⭐ Add Review
                  </button>
                )}
                {!user && (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/login')}
                  >
                    Login to Add Review
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Add Review Form */}
          {showReviewForm && user && (
            <div className="card mb-4 border-primary">
              <div className="card-header bg-light border-primary">
                <h5 className="mb-0">Write Your Review</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Your Rating</label>
                  <div className="d-flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        className={`btn btn-sm ${newReview.rating >= star ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <small className="text-muted">{newReview.rating} star{newReview.rating !== 1 ? 's' : ''}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Your Comment</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Share your experience with this car..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary flex-grow-1"
                    onClick={handleAddReview}
                  >
                    Submit Review
                  </button>
                  <button 
                    className="btn btn-outline-secondary flex-grow-1"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card mt-5">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Customer Reviews ({reviews.length})</h5>
        </div>
        <div className="card-body">
          {reviewsLoading ? (
            <div className="text-center py-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-muted mb-0">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="row g-3">
              {reviews.map(review => (
                <div key={review.id} className="col-md-6">
                  <div className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <strong>{review.userName || 'Anonymous'}</strong>
                      </div>
                      <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div className="mb-2">{renderStars(review.rating)}</div>
                    {review.comment && (
                      <p className="mb-0 text-muted">{review.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
