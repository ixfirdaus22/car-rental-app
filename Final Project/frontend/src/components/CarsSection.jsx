import { useState, useEffect } from 'react';
import CarCard from './CarCard';
import { getAllAvailableVehicles } from '../services/api';

// Helper function to resolve image path
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
  const makeModel = `${make || ''}${model || ''}`.toLowerCase();
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
    if (makeModel.includes(key.replace(/\s+/g, ''))) {
      return path;
    }
  }

  // Final fallback
  return '/vehicle-images/Accord.jpg';
};

export default function CarsSection() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterFuel, setFilterFuel] = useState("All");
  const [filterTransmission, setFilterTransmission] = useState("All");
  const [filterSeats, setFilterSeats] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllAvailableVehicles();
      // Transform backend vehicle data to match frontend car structure
      const transformedVehicles = (response.data || []).map(vehicle => ({
        id: vehicle.id,
        carId: vehicle.id,
        brand: vehicle.make,
        make: vehicle.make,
        model: vehicle.model,
        type: "Sedan", // Default, can be enhanced later
        seats: vehicle.seatingCapacity,
        seatingCapacity: vehicle.seatingCapacity,
        fuel: vehicle.fuelType,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        mileage: "N/A",
        basePricePerDay: vehicle.pricePerDay,
        pricePerDay: vehicle.pricePerDay,
        img: getImagePath(vehicle.imageUrl, vehicle.make, vehicle.model),
        imageUrl: vehicle.imageUrl,
        year: vehicle.year,
        color: vehicle.color,
        description: vehicle.description,
        vendorName: vehicle.vendorName
      }));
      setVehicles(transformedVehicles);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError("Failed to connect to the backend server. Please ensure the backend is running.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Available locations for dropdown
  const LOCATIONS = ["All Locations", "Delhi", "Mumbai", "Bangalore", "Pune", "Chennai", "Hyderabad", "Jaipur"];

  const filteredCars = vehicles.filter(car => {
    // Type filter (can be enhanced when vehicle type is added to backend)
    // if (filterType !== "All" && car.type !== filterType) return false;

    // Fuel filter
    if (filterFuel !== "All" && car.fuel.toUpperCase() !== filterFuel.toUpperCase()) return false;

    // Transmission filter
    if (filterTransmission !== "All" && car.transmission.toUpperCase() !== filterTransmission.toUpperCase()) return false;

    // Seats filter
    if (filterSeats !== "All" && car.seats !== parseInt(filterSeats)) return false;

    // Price filter
    if (car.basePricePerDay > maxPrice) return false;

    return true;
  });

  const resetFilters = () => {
    setLocation("");
    setFilterType("All");
    setFilterFuel("All");
    setFilterTransmission("All");
    setFilterSeats("All");
    setMaxPrice(10000);
  };

  if (loading) {
    return (
      <section id="cars" className="py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading available vehicles...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="cars" className="py-5">
        <div className="container text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Connection Error</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              <button className="btn btn-outline-danger btn-sm" onClick={fetchVehicles}>Retry</button>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cars" className="py-5">
      <div className="container">
        <h2 className="mb-4 fw-bold">Find Your Perfect Car</h2>

        {/* Location and Filters Section */}
        <div className="card bg-light p-4 mb-5">
          <h5 className="mb-3 fw-bold">Search & Filter Options</h5>

          {/* Location Input */}
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Pick-up Location</label>
              <select
                className="form-select form-select-lg"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Select a location</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Selected Location</label>
              <div className="p-3 bg-white rounded border">
                <span className="text-muted">{location || "No location selected"}</span>
              </div>
            </div>
          </div>

          {/* Filter Chips/Buttons */}
          <div className="row g-3">
            {/* Car Type Filter */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-bold">Car Type</label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-bold">Fuel Type</label>
              <select
                className="form-select"
                value={filterFuel}
                onChange={(e) => setFilterFuel(e.target.value)}
              >
                <option value="All">All Fuels</option>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            {/* Transmission Filter */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-bold">Transmission</label>
              <select
                className="form-select"
                value={filterTransmission}
                onChange={(e) => setFilterTransmission(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </div>

            {/* Seats Filter */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-bold">Seats</label>
              <select
                className="form-select"
                value={filterSeats}
                onChange={(e) => setFilterSeats(e.target.value)}
              >
                <option value="All">All Seats</option>
                <option value="5">5 Seater</option>
                <option value="7">7 Seater</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="row g-3 mt-2">
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold">Max Price per Day: ₹{maxPrice}</label>
              <input
                type="range"
                className="form-range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              />
              <div className="text-muted small mt-1">₹1000 - ₹10000</div>
            </div>

            {/* Reset Button */}
            <div className="col-12 col-md-6 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-3">
          <p className="text-muted">
            Showing <strong>{filteredCars.length}</strong> car(s)
            {location && ` in ${location}`}
          </p>
        </div>

        {/* Cars grid */}
        {filteredCars.length > 0 ? (
          <div className="row g-4">
            {filteredCars.map(car => (
              <div key={car.carId} className="col-md-6 col-lg-4">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-warning text-center py-5">
            <h5>No cars found matching your criteria</h5>
            <p className="mb-0">Try adjusting your filters or location</p>
          </div>
        )}
      </div>
    </section>
  );
}
