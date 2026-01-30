# Vendor Portal Documentation

## Overview
A complete vendor management portal has been integrated into your car rental application. Vendors can register separately, manage their fleet, track bookings, and monitor revenue.

## Features

### 1. **Vendor Registration**
- New registration option on `/register` page
- Toggle between "Customer" and "Vendor" registration
- Vendor registration requires:
  - Full Name
  - Email
  - Phone Number
  - Business Name
  - Business Address
  - Password

### 2. **Vendor Dashboard** (`/vendor/dashboard`)
- **Stats Overview**:
  - Total Active Cars
  - Active Bookings
  - Completed Bookings
  - Monthly Earnings
  - Performance Rating

- **Revenue Overview**:
  - 6-month revenue chart
  - Total earnings and averages
  - Performance metrics (rating, response time, cancellation rate)

- **Recent Bookings Table**:
  - View latest bookings
  - Quick action buttons
  - Booking status tracking

### 3. **My Cars Management** (`/vendor/cars`)
- **Car Statistics**:
  - Total cars count
  - Available cars
  - Total bookings across all cars
  - Estimated revenue

- **Car Cards**:
  - Visual car display (emoji)
  - Car specifications (fuel, transmission, seating)
  - Daily rental rate
  - Customer rating
  - Booking count

- **Car Table View**:
  - Detailed car information
  - Registration numbers
  - Performance metrics
  - Status indicators

- **Features**:
  - Add new cars
  - Edit car details
  - View detailed car information
  - Track car ratings and bookings

### 4. **Bookings Management** (`/vendor/bookings`)
- **Filter Options**:
  - All bookings
  - Active bookings
  - Pending approvals
  - Confirmed bookings
  - Completed bookings
  - Cancelled bookings

- **Booking Cards**:
  - Customer information
  - Car details
  - Booking dates and duration
  - Total amount
  - Customer ratings (if completed)

- **Booking Table**:
  - Comprehensive booking details
  - Customer contact information
  - Duration tracking
  - Amount and status

- **Booking Details Modal**:
  - Full customer information
  - Vehicle details
  - Pickup/return locations and dates
  - Payment information
  - Customer feedback/ratings
  - Action buttons (approve/reject for pending)

### 5. **Revenue Management** (`/vendor/revenue`)
- **Revenue Statistics**:
  - Total revenue (all time)
  - Monthly averages
  - Total bookings
  - Average customer rating

- **Revenue Chart**:
  - Interactive 6-month trend
  - Visual bar chart
  - Click on bars to view detailed month stats

- **Transaction History**:
  - Individual transaction tracking
  - Booking to transaction mapping
  - Payment status (pending/completed/refunded)
  - Amount details

- **Payout Information**:
  - Current balance display
  - Bank account details
  - Request payout functionality
  - Update bank details

### 6. **Settings** (`/vendor/settings`)
- **Personal Information**:
  - Edit full name
  - Update email
  - Modify phone number

- **Business Information**:
  - Business name
  - Business address
  - Business phone
  - Tax ID (TIN)

- **Bank Details**:
  - Account holder name
  - Account number
  - IFSC code
  - Bank verification

- **Notification Preferences**:
  - Email notifications
  - SMS notifications
  - Push notifications
  - Weekly/monthly reports
  - Auto-approve bookings
  - Maintenance reminders
  - Document expiry alerts

- **Account Management**:
  - Change password
  - Delete account (with warning)

## Vendor Layout Features

### Sidebar Navigation
- **Sticky sidebar** with vendor profile
- **Navigation links**:
  - 📊 Dashboard
  - 🚗 My Cars
  - 📅 Bookings
  - 💰 Revenue
  - ⚙️ Settings
- **Quick access** to profile and logout

### Top Navigation Bar
- Welcome message with vendor name
- Online status indicator
- Responsive design

## Authentication Flow

### User Role Management
The application now supports two user roles:
1. **Customer** - Browse and book cars
2. **Vendor** - Manage cars and bookings

### Login/Register Routes
- Customers: redirected to home page `/`
- Vendors: redirected to vendor dashboard `/vendor/dashboard`

### Access Control
- Vendor routes protected - requires `user.role === 'vendor'`
- Automatic redirection to login if unauthorized

## Data Management

### Mock Data Included
All pages include sample data for demonstration:
- Sample cars with specifications
- Sample bookings with customer details
- Revenue data for charts
- Customer ratings and feedback

### Future Integration
Replace mock data with API calls:
```javascript
// Example API endpoint structure
GET  /api/vendor/cars
POST /api/vendor/cars
GET  /api/vendor/bookings
GET  /api/vendor/revenue
PUT  /api/vendor/settings
```

## Styling

### Color Scheme (from main theme)
- **Primary**: `#0066cc` (Blue)
- **Accent**: `#ff8c42` (Orange)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)

### Responsive Design
- Desktop: Full sidebar navigation
- Tablet: Compact sidebar
- Mobile: Slide-out sidebar (can be implemented)

## Pages Created

```
src/
├── layouts/
│   └── VendorLayout.jsx          (Main vendor layout with sidebar)
├── pages/
│   └── Vendor/
│       ├── VendorDashboard.jsx     (Stats, revenue, recent bookings)
│       ├── VendorCars.jsx          (Car management)
│       ├── VendorBookings.jsx      (Booking management)
│       ├── VendorRevenue.jsx       (Revenue tracking & payouts)
│       └── VendorSettings.jsx      (Profile & preferences)
```

## File Modifications

1. **src/App.jsx** - Added vendor routes
2. **src/context/AuthContext.jsx** - Updated to support vendor role
3. **src/pages/Auth/RegisterPage.jsx** - Added vendor registration option
4. **src/App.css** - Added comprehensive vendor portal styles
5. **src/layouts/VendorLayout.jsx** - Created new vendor layout

## Next Steps

1. **API Integration**:
   - Connect to backend API endpoints
   - Replace mock data with real data
   - Implement real-time notifications

2. **Features to Add**:
   - Car image uploads
   - Document management (insurance, license)
   - Customer reviews and ratings
   - Maintenance scheduling
   - Advanced analytics
   - Bulk operations

3. **Improvements**:
   - Mobile-responsive sidebar toggle
   - Loading states and skeletons
   - Error handling and validation
   - Success/error notifications
   - Print/export functionality

## Usage Example

### Register as Vendor
1. Go to `/register`
2. Select "🚗 Vendor" option
3. Fill in required information
4. Click "Register"
5. Auto-redirected to `/vendor/dashboard`

### Navigate Portal
- Use sidebar menu to navigate between sections
- Click "Logout" to sign out
- Access profile via "👤 My Profile"

---

The vendor portal is now fully functional and ready for customization and API integration!
