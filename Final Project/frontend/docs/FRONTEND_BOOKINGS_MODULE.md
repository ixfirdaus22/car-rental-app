# Frontend Bookings Module - Comprehensive Implementation Documentation

## Overview
The Frontend Bookings Module allows users to view their bookings, cancel bookings, and view booking details. It integrates with the backend Booking API to manage user's rental bookings.

---

## Table of Contents
1. [Architecture](#architecture)
2. [Core Concepts Used](#core-concepts-used)
3. [React Concepts](#react-concepts)
4. [Component Implementation](#component-implementation)
5. [How It Works - Step by Step](#how-it-works---step-by-step)
6. [Interview Questions & Answers](#interview-questions--answers)

---

## Architecture

### Component Structure
```
BookingsPage.jsx
  ├── Tab Navigation (Current/Past bookings)
  ├── Booking List
  │   ├── Booking Card
  │   │   ├── Vehicle Image
  │   │   ├── Booking Details
  │   │   ├── Status Badge
  │   │   └── Action Buttons (View Details, Cancel)
  │   └── Booking Details Modal
  └── Empty State
```

---

## Core Concepts Used

### 1. **Tab-Based UI Pattern**
**What it is**: Organizing content into tabs for better UX.

**How it's used**:
```javascript
const [activeTab, setActiveTab] = useState('current');

const currentBookings = bookings.filter(b => 
  ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(b.status)
);

const pastBookings = bookings.filter(b => 
  ['COMPLETED', 'CANCELLED'].includes(b.status)
);
```

**Why use tabs?**
- **Organization**: Separate current and past bookings
- **User experience**: Easy navigation
- **Performance**: Only render active tab content

---

### 2. **Modal Pattern**
**What it is**: Overlay dialog for detailed information.

**How it's used**:
```javascript
const [selectedBooking, setSelectedBooking] = useState(null);
const [bookingDetails, setBookingDetails] = useState(null);

const handleViewDetails = async (bookingId) => {
  const response = await getBookingById(bookingId);
  setBookingDetails(response.data);
  setSelectedBooking(bookingId);
};

// Modal display
{selectedBooking && (
  <div className="modal show">
    {/* Booking details */}
    <button onClick={() => setSelectedBooking(null)}>Close</button>
  </div>
)}
```

**Why use modals?**
- **Focus**: User focuses on one booking
- **Context**: Stay on same page
- **UX**: Smooth interaction

---

### 3. **Date Formatting**
**What it is**: Formatting dates for display.

**How it's used**:
```javascript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateDays = (pickupDate, returnDate) => {
  const pickup = new Date(pickupDate);
  const return_ = new Date(returnDate);
  const diffTime = Math.abs(return_ - pickup);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
```

**Why format dates?**
- **User-friendly**: Readable format
- **Localization**: Support different locales
- **Consistency**: Uniform date display

---

### 4. **Status-Based Filtering**
**What it is**: Filtering bookings by status.

**How it's used**:
```javascript
const currentBookings = bookings.filter(booking => 
  ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(booking.status)
);

const pastBookings = bookings.filter(booking => 
  ['COMPLETED', 'CANCELLED'].includes(booking.status)
);
```

**Status categories**:
- **Current**: PENDING, CONFIRMED, ACTIVE
- **Past**: COMPLETED, CANCELLED

---

### 5. **Confirmation Dialog Pattern**
**What it is**: Asking user confirmation before destructive actions.

**How it's used**:
```javascript
const handleCancelBooking = async (bookingId) => {
  if (!window.confirm('Are you sure you want to cancel this booking?')) {
    return; // User cancelled
  }
  
  try {
    await cancelBooking(bookingId);
    alert('Booking cancelled successfully!');
    fetchBookings(); // Refresh list
  } catch (err) {
    alert('Failed to cancel booking');
  }
};
```

**Why use confirmation?**
- **Prevent mistakes**: User confirms destructive action
- **User control**: User can cancel action
- **UX best practice**: Standard pattern for deletions

---

## React Concepts

### 1. **Conditional Rendering Based on Data**
**How it's used**:
```javascript
{bookings.length === 0 ? (
  <div>No bookings found</div>
) : (
  <div>
    {bookings.map(booking => (
      <BookingCard key={booking.id} booking={booking} />
    ))}
  </div>
)}
```

---

### 2. **State Management for Modal**
**How it's used**:
```javascript
const [selectedBooking, setSelectedBooking] = useState(null);
const [bookingDetails, setBookingDetails] = useState(null);
const [loadingDetails, setLoadingDetails] = useState(false);

// Open modal
const handleViewDetails = async (bookingId) => {
  setLoadingDetails(true);
  setSelectedBooking(bookingId);
  const response = await getBookingById(bookingId);
  setBookingDetails(response.data);
  setLoadingDetails(false);
};

// Close modal
const handleCloseModal = () => {
  setSelectedBooking(null);
  setBookingDetails(null);
};
```

---

### 3. **Error Handling with User Feedback**
**How it's used**:
```javascript
try {
  await cancelBooking(bookingId);
  alert('Booking cancelled successfully!');
  fetchBookings();
} catch (err) {
  alert(err.response?.data?.message || 'Failed to cancel booking');
  console.error('Error:', err);
}
```

**Error handling patterns**:
- **Try-catch**: Wrap async operations
- **User feedback**: Alert or toast notification
- **Error messages**: Show backend error or generic message
- **Logging**: Console.error for debugging

---

## Component Implementation

### BookingsPage Component
**File:** `pages/Bookings/BookingsPage.jsx`

**Features**:
- Tab navigation (Current/Past)
- Booking list display
- Booking details modal
- Cancel booking functionality
- Loading states
- Error handling

**State management**:
```javascript
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('current');
const [selectedBooking, setSelectedBooking] = useState(null);
const [bookingDetails, setBookingDetails] = useState(null);
```

**Data fetching**:
```javascript
useEffect(() => {
  if (user) {
    fetchBookings();
  }
}, [user]);

const fetchBookings = async () => {
  try {
    setLoading(true);
    const response = await getUserBookings();
    setBookings(response.data || []);
  } catch (err) {
    console.error('Error:', err);
    setBookings([]);
  } finally {
    setLoading(false);
  }
};
```

---

## How It Works - Step by Step

### Example: User Views Bookings

**1. Component mounts**:
```javascript
useEffect(() => {
  if (user) {
    fetchBookings();
  }
}, [user]);
```

**2. Fetch bookings**:
```javascript
const response = await getUserBookings();
// Response: [{ id: 1, vehicleId: 1, status: 'CONFIRMED', ... }, ...]
setBookings(response.data);
```

**3. Filter by tab**:
```javascript
const currentBookings = bookings.filter(b => 
  ['PENDING', 'CONFIRMED', 'ACTIVE'].includes(b.status)
);
```

**4. Display bookings**:
```javascript
{currentBookings.map(booking => (
  <BookingCard 
    key={booking.id} 
    booking={booking}
    onViewDetails={handleViewDetails}
    onCancel={handleCancelBooking}
  />
))}
```

**5. User clicks "View Details"**:
```javascript
const handleViewDetails = async (bookingId) => {
  setLoadingDetails(true);
  const response = await getBookingById(bookingId);
  setBookingDetails(response.data);
  setSelectedBooking(bookingId);
  setLoadingDetails(false);
};
```

**6. Modal displays**:
```javascript
{selectedBooking && (
  <Modal>
    {loadingDetails ? (
      <Spinner />
    ) : (
      <BookingDetails data={bookingDetails} />
    )}
  </Modal>
)}
```

---

## Interview Questions & Answers

### Q1: "How do you implement tab-based navigation in React?"
**Answer**: 
Use state to track active tab and filter data accordingly:
```javascript
const [activeTab, setActiveTab] = useState('current');

const currentData = data.filter(item => item.status === 'active');
const pastData = data.filter(item => item.status === 'completed');

return (
  <div>
    <button onClick={() => setActiveTab('current')}>Current</button>
    <button onClick={() => setActiveTab('past')}>Past</button>
    {activeTab === 'current' ? (
      <CurrentList data={currentData} />
    ) : (
      <PastList data={pastData} />
    )}
  </div>
);
```

---

### Q2: "How do you handle modal state management?"
**Answer**: 
Use state to track selected item and modal visibility:
```javascript
const [selectedItem, setSelectedItem] = useState(null);
const [itemDetails, setItemDetails] = useState(null);

const handleOpenModal = async (id) => {
  setSelectedItem(id);
  const response = await fetchItem(id);
  setItemDetails(response.data);
};

const handleCloseModal = () => {
  setSelectedItem(null);
  setItemDetails(null);
};

// Render modal
{selectedItem && (
  <Modal onClose={handleCloseModal}>
    <ItemDetails data={itemDetails} />
  </Modal>
)}
```

---

### Q3: "How do you format dates in React?"
**Answer**: 
Use JavaScript Date methods or libraries:
```javascript
// Native JavaScript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Using date-fns library (better)
import { format } from 'date-fns';
const formatted = format(new Date(dateString), 'MMMM dd, yyyy');
```

---

## Summary

The Frontend Bookings Module provides:
- ✅ **Booking list**: View all user bookings
- ✅ **Tab navigation**: Separate current and past bookings
- ✅ **Booking details**: Modal with detailed information
- ✅ **Cancel booking**: Cancel with confirmation
- ✅ **Status filtering**: Filter by booking status
- ✅ **Date calculations**: Calculate rental duration
- ✅ **Error handling**: Comprehensive error handling

**Status: ✅ FULLY IMPLEMENTED**
