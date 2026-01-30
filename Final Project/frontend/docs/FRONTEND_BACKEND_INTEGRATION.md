# Frontend-Backend Integration - Comprehensive Documentation

## Overview
This document provides comprehensive documentation on how the frontend integrates with the backend, including API communication patterns, data transformation, error handling, and authentication flow.

---

## Table of Contents
1. [Integration Architecture](#integration-architecture)
2. [Core Integration Concepts](#core-integration-concepts)
3. [API Communication Patterns](#api-communication-patterns)
4. [Data Transformation](#data-transformation)
5. [Error Handling](#error-handling)
6. [Authentication Flow](#authentication-flow)
7. [Module-Specific Integration](#module-specific-integration)
8. [Interview Questions & Answers](#interview-questions--answers)

---

## Integration Architecture

### Communication Flow
```
Frontend Component
    ↓
API Service (api.js)
    ↓
Axios Interceptor (adds token)
    ↓
HTTP Request
    ↓
Backend Controller
    ↓
Backend Service
    ↓
Database
    ↓
Response
    ↓
Frontend Component (updates state)
```

---

## Core Integration Concepts

### 1. **Axios Instance Configuration**
**What it is**: Configured Axios instance with base URL and interceptors.

**How it's used**:
```javascript
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Request interceptor - Add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Why use configured instance?**
- **Base URL**: Don't repeat URL in every call
- **Interceptors**: Automatic token injection
- **Centralized**: Single place for configuration

---

### 2. **Request Interceptor Pattern**
**What it is**: Automatically adding authentication token to requests.

**How it's used**:
```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Why use interceptors?**
- **DRY principle**: Don't repeat token logic
- **Automatic**: Works for all API calls
- **Centralized**: Single place for auth headers

**Interview Question**: "How do you automatically add JWT token to API requests?"
**Answer**: Use Axios request interceptor:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 3. **Response Interceptor Pattern (Future Enhancement)**
**What it is**: Handling responses globally (error handling, token refresh).

**How it would be used**:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

### 4. **Data Transformation Pattern**
**What it is**: Transforming backend data structure to match frontend expectations.

**How it's used**:
```javascript
const transformedVehicles = backendData.map(vehicle => ({
  id: vehicle.id,
  brand: vehicle.make,        // Backend: make → Frontend: brand
  seats: vehicle.seatingCapacity, // Backend: seatingCapacity → Frontend: seats
  price: vehicle.pricePerDay,
  image: `/images/${vehicle.imageUrl}`
}));
```

**Why transform data?**
- **API independence**: Frontend structure independent of backend
- **Naming consistency**: Use frontend naming conventions
- **Data enrichment**: Add computed fields, format data

---

### 5. **Error Handling Pattern**
**What it is**: Consistent error handling across API calls.

**How it's used**:
```javascript
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (err) {
  // Handle different error types
  if (err.response?.status === 401) {
    // Unauthorized - redirect to login
    navigate('/login');
  } else if (err.response?.status === 403) {
    // Forbidden - show access denied
    setError('Access denied');
  } else {
    // Other errors
    setError(err.response?.data?.message || 'An error occurred');
  }
}
```

**Error handling strategy**:
- **401 Unauthorized**: Redirect to login
- **403 Forbidden**: Show access denied message
- **400 Bad Request**: Show validation errors
- **500 Server Error**: Show generic error message
- **Network Error**: Show network error message

---

## API Communication Patterns

### 1. **GET Request Pattern**
**How it's used**:
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### 2. **POST Request Pattern**
**How it's used**:
```javascript
const createData = async (formData) => {
  try {
    setLoading(true);
    const response = await api.post('/endpoint', formData);
    // Success handling
    alert('Created successfully');
    fetchData(); // Refresh list
  } catch (err) {
    setError(err.response?.data?.message || 'Creation failed');
  } finally {
    setLoading(false);
  }
};
```

---

### 3. **PUT Request Pattern**
**How it's used**:
```javascript
const updateData = async (id, formData) => {
  try {
    await api.put(`/endpoint/${id}`, formData);
    alert('Updated successfully');
    fetchData(); // Refresh
  } catch (err) {
    setError(err.response?.data?.message || 'Update failed');
  }
};
```

---

### 4. **DELETE Request Pattern**
**How it's used**:
```javascript
const deleteData = async (id) => {
  if (!confirm('Are you sure?')) return;
  
  try {
    await api.delete(`/endpoint/${id}`);
    alert('Deleted successfully');
    fetchData(); // Refresh
  } catch (err) {
    setError(err.response?.data?.message || 'Deletion failed');
  }
};
```

---

## Data Transformation

### Backend to Frontend Mapping

**Vehicle Mapping**:
```javascript
{
  // Backend → Frontend
  id → id
  make → brand
  model → model
  pricePerDay → basePricePerDay
  fuelType → fuel
  transmission → transmission
  seatingCapacity → seats
  imageUrl → img (with path resolution)
  status → status
}
```

**Booking Mapping**:
```javascript
{
  id → id
  userId → userId
  vehicleId → vehicleId
  pickupDate → pickupDate
  returnDate → returnDate
  totalAmount → totalCost
  status → status
}
```

**Why transform?**
- **Naming consistency**: Frontend uses different naming
- **Data enrichment**: Add computed fields
- **Path resolution**: Resolve image paths
- **Format conversion**: Convert date formats

---

## Error Handling

### Error Response Structure
**Backend error format**:
```json
{
  "message": "Error message",
  "status": 400,
  "timestamp": "2025-01-26T10:00:00"
}
```

**Frontend error handling**:
```javascript
catch (err) {
  // String error
  if (typeof err.response?.data === 'string') {
    setError(err.response.data);
  }
  // Object error
  else if (err.response?.data?.message) {
    setError(err.response.data.message);
  }
  // Network error
  else if (err.message) {
    setError(err.message);
  }
  // Generic error
  else {
    setError('An error occurred');
  }
}
```

---

## Authentication Flow

### Complete Flow
```
1. User logs in → Frontend calls /api/auth/login
2. Backend returns JWT token + user data
3. Frontend stores token in localStorage
4. Frontend stores user in Context
5. Subsequent requests → Axios interceptor adds token
6. Backend validates token → Returns data
7. Frontend updates UI with data
```

**Code flow**:
```javascript
// Login
const response = await login({ email, password });
localStorage.setItem('token', response.data.token);
authLogin(response.data); // Update context

// Subsequent requests
// Interceptor automatically adds: Authorization: Bearer <token>
const data = await getVehicles();
```

---

## Module-Specific Integration

### Vehicle Module Integration
**API calls**:
- `getAllAvailableVehicles()` → `GET /api/vehicles`
- `getVehicleById(id)` → `GET /api/vehicles/{id}`
- `getVendorVehicles()` → `GET /api/vehicles/vendor`
- `addVehicle(data)` → `POST /api/vehicles`
- `updateVehicle(id, data)` → `PUT /api/vehicles/{id}`
- `deleteVehicle(id)` → `DELETE /api/vehicles/{id}`

**Data transformation**: Backend vehicle → Frontend car structure

---

### Booking Module Integration
**API calls**:
- `createBooking(data)` → `POST /api/bookings`
- `getUserBookings()` → `GET /api/bookings/user`
- `getBookingById(id)` → `GET /api/bookings/{id}`
- `cancelBooking(id)` → `PUT /api/bookings/{id}/cancel`

**Flow**: Create booking → Create payment → Update UI

---

### Payment Module Integration
**API calls**:
- `createPayment(data)` → `POST /api/payments`
- `getPaymentByBookingId(id)` → `GET /api/payments/{id}`

**Flow**: Sequential API calls (booking → payment)

---

## Interview Questions & Answers

### Q1: "How does frontend communicate with backend?"
**Answer**: 
1. **Axios**: HTTP client for API calls
2. **Base URL**: Configured in axios instance
3. **Interceptors**: Automatic token injection
4. **API functions**: Wrapper functions in api.js
5. **Error handling**: Try-catch with user feedback

**Code**:
```javascript
// Configured instance
const api = axios.create({ baseURL: 'http://localhost:8080/api' });

// API function
export const getVehicles = () => api.get('/vehicles');

// Usage
const response = await getVehicles();
setVehicles(response.data);
```

---

### Q2: "How do you handle CORS in frontend-backend communication?"
**Answer**: 
**Backend configuration** (Spring Boot):
```java
@CrossOrigin("*") // Allow all origins (development)
// Or
@CrossOrigin(origins = {"http://localhost:5173"}) // Specific origins
```

**Frontend**: No special configuration needed if backend allows CORS

**Production**: Configure specific origins, not "*"

---

### Q3: "How do you handle API errors in React?"
**Answer**: 
Use try-catch with different error handling:
```javascript
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (err) {
  if (err.response?.status === 401) {
    // Unauthorized
    navigate('/login');
  } else if (err.response?.status === 403) {
    // Forbidden
    setError('Access denied');
  } else {
    // Other errors
    setError(err.response?.data?.message || 'Error occurred');
  }
}
```

---

## Summary

The Frontend-Backend Integration provides:
- ✅ **API communication**: Axios with interceptors
- ✅ **Data transformation**: Backend to frontend mapping
- ✅ **Error handling**: Comprehensive error handling
- ✅ **Authentication**: Token-based authentication
- ✅ **State management**: Context API for global state
- ✅ **Loading states**: User feedback during API calls
- ✅ **Error states**: User-friendly error messages

**Status: ✅ FULLY INTEGRATED**

---

## Overview
This document summarizes the integration of the frontend vendor portal with the Vehicle & Vendor backend module.

## Completed Integrations

### 1. API Service Layer (`src/services/api.js`)
✅ Added vehicle-related API functions:
- `getAllAvailableVehicles()` - Get all available vehicles (for customers)
- `getVehicleById(id)` - Get vehicle by ID
- `getVendorVehicles()` - Get vendor's vehicles
- `addVehicle(vehicleData)` - Add new vehicle (vendor only)
- `updateVehicle(id, vehicleData)` - Update vehicle (vendor only)
- `deleteVehicle(id)` - Delete vehicle (vendor only)
- `updateVehicleStatus(id, statusData)` - Update vehicle status (vendor only)

### 2. Vendor Cars Page (`src/pages/Vendor/VendorCars.jsx`)
✅ **Complete Backend Integration:**
- Fetches vehicles from backend using `getVendorVehicles()`
- Displays real vehicle data with proper status badges
- Loading states and error handling
- Add Vehicle functionality with form validation
- Edit Vehicle functionality with pre-filled form
- Delete Vehicle functionality with confirmation
- Status Update functionality with modal
- Filter by vehicle status (All, Available, Rented, Maintenance, Unavailable)
- Real-time statistics (Total Cars, Available, etc.)
- Responsive design with modals for all operations

**Features:**
- ✅ Add new vehicle with complete form (make, model, year, color, license plate, VIN, price, fuel type, transmission, seating, description, image URL)
- ✅ Edit existing vehicle with all fields
- ✅ Delete vehicle with confirmation dialog
- ✅ Update vehicle status (Available, Rented, Maintenance, Unavailable)
- ✅ View vehicle details in modal
- ✅ Filter vehicles by status
- ✅ Display vehicle statistics

### 3. Vendor Dashboard (`src/pages/Vendor/VendorDashboard.jsx`)
✅ **Backend Integration:**
- Fetches vehicles from backend to calculate real statistics
- Displays:
  - Total Cars (from backend)
  - Available Cars (filtered by status)
  - Rented Cars (filtered by status)
  - Total Value (sum of daily rates)
- Loading state while fetching data
- Real-time data updates

**Note:** Booking-related stats (Active Bookings, Completed Bookings, Monthly Earnings) will be updated when the Booking module is implemented.

### 4. Customer Cars Section (`src/components/CarsSection.jsx`)
✅ **Backend Integration:**
- Fetches available vehicles from backend using `getAllAvailableVehicles()`
- Transforms backend vehicle data to match frontend car structure
- Filters work with real backend data:
  - Fuel type filter (Petrol, Diesel, Electric, Hybrid)
  - Transmission filter (Manual, Automatic)
  - Seats filter
  - Price range filter
- Loading state while fetching
- Error handling

## API Endpoints Used

### Vendor Endpoints (Require VENDOR role)
- `GET /api/vehicles/vendor` - Get vendor's vehicles
- `POST /api/vehicles` - Add new vehicle
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle
- `PUT /api/vehicles/{id}/status` - Update vehicle status

### Customer/User Endpoints (Require authentication)
- `GET /api/vehicles` - Get all available vehicles
- `GET /api/vehicles/{id}` - Get vehicle by ID

## Data Transformation

### Backend to Frontend Vehicle Mapping
```javascript
{
  id → carId
  make → brand
  model → model
  year → year
  color → color
  pricePerDay → basePricePerDay
  fuelType → fuel
  transmission → transmission
  seatingCapacity → seats
  imageUrl → img
  status → status (AVAILABLE, RENTED, MAINTENANCE, UNAVAILABLE)
  vendorName → vendorName
  description → description
}
```

## Status Mapping

### Backend Status → Frontend Display
- `AVAILABLE` → "Available" (Green badge)
- `RENTED` → "Rented" (Blue badge)
- `MAINTENANCE` → "Maintenance" (Yellow badge)
- `UNAVAILABLE` → "Unavailable" (Gray badge)

## Form Fields

### Vehicle Add/Edit Form
- Make (required)
- Model (required)
- Year (required, 1900 - current year + 1)
- Color (required)
- License Plate (required, unique)
- VIN (required, unique)
- Price Per Day (required, positive number)
- Fuel Type (required, dropdown: Petrol, Diesel, Electric, Hybrid)
- Transmission (required, dropdown: Manual, Automatic)
- Seating Capacity (required, 1-20)
- Description (optional, textarea)
- Image URL (optional, URL input)

## Error Handling

### Implemented Error Handling:
- ✅ Network errors (connection issues)
- ✅ Authentication errors (401 Unauthorized)
- ✅ Authorization errors (403 Forbidden)
- ✅ Validation errors (400 Bad Request)
- ✅ Not found errors (404)
- ✅ Server errors (500)
- ✅ Duplicate license plate/VIN errors
- ✅ Ownership validation errors

### User Feedback:
- Alert messages for success/error
- Loading spinners during API calls
- Confirmation dialogs for destructive actions
- Form validation messages

## Loading States

### Implemented Loading States:
- ✅ Vendor Cars page - Loading spinner while fetching vehicles
- ✅ Vendor Dashboard - Loading spinner while fetching stats
- ✅ Customer Cars Section - Loading spinner while fetching available vehicles

## Security

### Authentication:
- ✅ JWT token automatically added to all requests via axios interceptor
- ✅ Token stored in localStorage
- ✅ Automatic token inclusion in Authorization header

### Authorization:
- ✅ Backend validates VENDOR role for vendor-only endpoints
- ✅ Frontend displays appropriate UI based on user role
- ✅ Service layer validates ownership before update/delete operations

## Testing Checklist

### Vendor Cars Page
- [ ] Add new vehicle with valid data
- [ ] Add vehicle with duplicate license plate (should fail)
- [ ] Add vehicle with duplicate VIN (should fail)
- [ ] Edit vehicle details
- [ ] Edit vehicle owned by another vendor (should fail)
- [ ] Delete vehicle
- [ ] Delete vehicle owned by another vendor (should fail)
- [ ] Update vehicle status
- [ ] Filter vehicles by status
- [ ] View vehicle details

### Vendor Dashboard
- [ ] Verify total cars count matches backend
- [ ] Verify available cars count is correct
- [ ] Verify rented cars count is correct
- [ ] Verify statistics update after adding/removing vehicles

### Customer Cars Section
- [ ] View all available vehicles
- [ ] Filter by fuel type
- [ ] Filter by transmission
- [ ] Filter by seats
- [ ] Filter by price range
- [ ] Verify only AVAILABLE vehicles are shown

## Future Enhancements

### When Booking Module is Implemented:
1. Update Vendor Dashboard to show real booking statistics
2. Add booking history to Vendor Cars page
3. Update vehicle status automatically when booked/returned
4. Add revenue calculations based on actual bookings

### Additional Features:
1. Image upload functionality (currently uses URL)
2. Bulk vehicle operations
3. Vehicle search functionality
4. Advanced filtering (by vendor, location, etc.)
5. Vehicle availability calendar
6. Export vehicle data
7. Vehicle analytics and reports

## Known Limitations

1. **Booking Integration**: Booking-related features are not yet integrated (will be added when Booking module is implemented)
2. **Image Upload**: Currently only supports image URLs, not file uploads
3. **Vehicle Type**: Vehicle type/category is not yet in backend (using default "Sedan")
4. **Location**: Location-based filtering is not yet integrated with backend
5. **Pagination**: Large vehicle lists are not paginated (can be added if needed)

## Files Modified

1. ✅ `src/services/api.js` - Added vehicle API functions
2. ✅ `src/pages/Vendor/VendorCars.jsx` - Complete backend integration
3. ✅ `src/pages/Vendor/VendorDashboard.jsx` - Backend integration for stats
4. ✅ `src/components/CarsSection.jsx` - Backend integration for customer view

## Summary

The frontend is now fully integrated with the Vehicle & Vendor backend module. All CRUD operations for vehicles are functional, and the vendor portal displays real-time data from the backend. The integration follows best practices with proper error handling, loading states, and user feedback.

**Status**: ✅ **COMPLETE** - Ready for testing and use!
