# Car Rental System - Frontend

A modern React-based frontend application for a comprehensive car rental management system. Built with React 19, Vite, and React Router, providing an intuitive user interface for Admins, Vendors, and Customers.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [User Roles & Features](#user-roles--features)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This frontend application provides a complete user interface for a car rental system, supporting three distinct user roles with role-specific dashboards and functionalities. The application features responsive design, real-time data updates, and seamless integration with the Spring Boot backend API.

## ✨ Features

### General Features
- 🔐 JWT-based authentication
- 👥 Multi-role support (Admin, Vendor, Customer)
- 📱 Responsive design
- 🎨 Modern UI/UX
- 🔄 Real-time data updates
- 📊 Data visualization with charts
- 🖼️ Image upload and management
- 📝 Form validation
- 🔔 Error handling and notifications

### Customer Features
- 🏠 Homepage with featured vehicles
- 🚗 Browse available vehicles
- 🔍 Vehicle search and filtering
- 📅 Book vehicles with date selection
- 💳 Payment processing (UPI)
- 📋 View booking history
- ⭐ Submit reviews
- 📢 File complaints
- 👤 Profile management

### Vendor Features
- 📊 Dashboard with statistics
- 🚗 Vehicle management (CRUD)
- 📸 Image upload for vehicles
- 📅 View bookings for their vehicles
- 💰 Revenue tracking
- ⚙️ Settings and profile management

### Admin Features
- 📊 Comprehensive dashboard with analytics
- 👥 User management (approve/reject/delete)
- 🚗 Vehicle management across all vendors
- 📅 Booking management
- 💳 Payment management
- ⭐ Review approval workflow
- 📢 Complaint resolution
- 📈 Reports & Analytics
  - Revenue trends
  - Booking analytics
  - Vehicle performance
  - User statistics

## 🛠 Technology Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.9.6
- **HTTP Client**: Axios 1.13.2
- **State Management**: React Context API
- **Charts**: Recharts 3.7.0
- **Styling**: CSS3
- **Code Quality**: ESLint

## 📁 Project Structure

```
frontend/
├── public/
│   ├── Accord.jpg
│   ├── creta.jpg
│   ├── Fortuner.jpg
│   ├── hero-car.jpg
│   ├── Maruti.jpg
│   ├── Nexon.jpg
│   ├── Swift.jpg
│   ├── XUV.jpg
│   ├── XUV500.jpg
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── CarCard.jsx
│   │   ├── CarsSection.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── Hero.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── authContext.js
│   │   ├── index.js
│   │   └── useAuth.js
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── BlankLayout.jsx
│   │   ├── MainLayout.jsx
│   │   └── VendorLayout.jsx
│   ├── pages/
│   │   ├── About/
│   │   │   └── AboutPage.jsx
│   │   ├── Admin/
│   │   │   ├── AdminBookingsPage.jsx
│   │   │   ├── AdminCarsPage.jsx
│   │   │   ├── AdminComplaintsPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminReportsPage.jsx
│   │   │   ├── AdminReviewsPage.jsx
│   │   │   ├── AdminSettingsPage.jsx
│   │   │   ├── AdminUsersPage.jsx
│   │   │   └── UserRegistrationRequestsPage.jsx
│   │   ├── Auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── Bookings/
│   │   │   └── BookingsPage.jsx
│   │   ├── Cars/
│   │   │   ├── CarDetailsPage.jsx
│   │   │   └── CarsPage.jsx
│   │   ├── Complaints/
│   │   │   └── ComplaintsPage.jsx
│   │   ├── Contact/
│   │   │   └── ContactPage.jsx
│   │   ├── Home/
│   │   │   └── HomePage.jsx
│   │   ├── Payment/
│   │   │   └── PaymentPage.jsx
│   │   ├── Profile/
│   │   │   └── UserProfilePage.jsx
│   │   ├── Reviews/
│   │   │   └── ReviewsPage.jsx
│   │   └── Vendor/
│   │       ├── VendorBookings.jsx
│   │       ├── VendorCars.jsx
│   │       ├── VendorDashboard.jsx
│   │       ├── VendorRevenue.jsx
│   │       └── VendorSettings.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (comes with Node.js)
- **Backend API**: Running on `http://localhost:8080`

## 🚀 Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd car-rental-system/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Endpoint

The API base URL is configured in `src/services/api.js`. By default, it points to:
```javascript
baseURL: 'http://localhost:8080/api'
```

Update this if your backend runs on a different port or host.

### 4. Run the Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173` (or the next available port)

## ⚙️ Configuration

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Then update `src/services/api.js` to use:
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
```

### Vite Configuration

The project uses Vite for fast development and optimized builds. Configuration is in `vite.config.js`.

## 📜 Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot module replacement (HMR).

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist` folder.

### Preview
```bash
npm run preview
```
Preview the production build locally.

### Lint
```bash
npm run lint
```
Run ESLint to check code quality.

## 👥 User Roles & Features

### Customer (CUSTOMER)
- Browse and search vehicles
- View vehicle details
- Create bookings
- Make payments (UPI)
- View booking history
- Submit reviews
- File complaints
- Manage profile

### Vendor (VENDOR)
- Dashboard with statistics
- Add/Edit/Delete vehicles
- Upload vehicle images
- View bookings for their vehicles
- Track revenue
- Manage profile and settings

### Admin (ADMIN)
- Comprehensive dashboard
- User management (approve/reject/delete)
- Vehicle management (all vendors)
- Booking management
- Payment management
- Review approval/rejection
- Complaint resolution
- Reports & Analytics

## 🗺️ Pages & Routes

### Public Routes
- `/` - Homepage
- `/about` - About page
- `/contact` - Contact page
- `/cars` - Browse vehicles
- `/cars/:id` - Vehicle details
- `/login` - Login page
- `/register` - Registration page

### Customer Routes
- `/bookings` - My bookings
- `/bookings/:id` - Booking details
- `/payment/:bookingId` - Payment page
- `/profile` - User profile
- `/reviews/vehicle/:vehicleId` - Reviews page
- `/complaints` - My complaints

### Vendor Routes
- `/vendor/dashboard` - Vendor dashboard
- `/vendor/cars` - My vehicles
- `/vendor/bookings` - My bookings
- `/vendor/revenue` - Revenue tracking
- `/vendor/settings` - Settings

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/users/pending` - Pending registrations
- `/admin/cars` - Vehicle management
- `/admin/bookings` - Booking management
- `/admin/reviews` - Review management
- `/admin/complaints` - Complaint management
- `/admin/reports` - Reports & Analytics
- `/admin/settings` - Admin settings

## 🧩 Components

### Layout Components
- `MainLayout.jsx` - Main layout with header/footer
- `AdminLayout.jsx` - Admin-specific layout with sidebar
- `VendorLayout.jsx` - Vendor-specific layout with sidebar
- `BlankLayout.jsx` - Minimal layout for auth pages

### Shared Components
- `Header.jsx` - Navigation header
- `Footer.jsx` - Footer component
- `Hero.jsx` - Hero section
- `CarCard.jsx` - Vehicle card component
- `CarsSection.jsx` - Vehicle listing section
- `About.jsx` - About section
- `Contact.jsx` - Contact section

## 🔄 State Management

The application uses React Context API for state management:

### AuthContext
- User authentication state
- JWT token management
- User role and profile data
- Login/logout functions

**Location**: `src/context/AuthContext.jsx`

**Usage**:
```javascript
import { useAuth } from '../context/useAuth';

const { user, token, login, logout } = useAuth();
```

## 🌐 API Integration

### API Service

All API calls are centralized in `src/services/api.js`:

```javascript
import api from './services/api';

// Example: Get vehicles
const vehicles = await api.get('/vehicles');

// Example: Create booking
const booking = await api.post('/bookings', bookingData);
```

### Authentication

JWT tokens are automatically included in API requests via axios interceptors:

```javascript
// Token is automatically added to headers
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

Access the application at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🏗️ Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Output**: The optimized build will be in the `dist/` folder

3. **Deploy**: Deploy the `dist/` folder to your hosting service:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Any static hosting service

### Example Deployment Commands

**Netlify**:
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Vercel**:
```bash
npm run build
vercel --prod
```

## 🎨 Styling

The application uses:
- **CSS3** for styling
- **CSS Modules** (where applicable)
- **Responsive Design** with media queries
- **Custom Color Theme** (see `COLOR_THEME.md`)

## 📸 Image Management

Vehicle images are stored in:
- `public/` folder for static images
- Backend handles uploaded images
- Images referenced by filename/path

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend is running on `http://localhost:8080`
   - Check CORS configuration in backend
   - Verify API base URL in `src/services/api.js`

2. **Authentication Issues**
   - Clear browser localStorage
   - Check token expiration
   - Verify JWT token in browser DevTools

3. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version` (should be 18+)
   - Clear Vite cache: `rm -rf .vite`

4. **Routing Issues**
   - Ensure React Router is properly configured
   - Check route paths match backend endpoints
   - Verify protected routes have authentication checks

5. **Image Loading Issues**
   - Verify image paths are correct
   - Check if images exist in `public/` folder
   - Ensure backend image serving is configured

### Development Tips

- Use React DevTools for debugging
- Check browser console for errors
- Use Network tab to inspect API calls
- Verify API responses in browser DevTools

## 📚 Additional Documentation

- **Vendor Implementation**: `VENDOR_IMPLEMENTATION.md`
- **Vendor Portal**: `VENDOR_PORTAL.md`
- **Vendor Testing**: `VENDOR_TESTING.md`
- **Color Theme**: `COLOR_THEME.md`

## 🔐 Security Considerations

- JWT tokens stored in localStorage
- Tokens automatically included in API requests
- Role-based route protection
- Input validation on forms
- XSS protection via React's built-in escaping

## 🚀 Performance Optimization

- Code splitting with React Router
- Lazy loading for routes
- Optimized images
- Vite's fast HMR
- Production build optimization

## 📝 Code Style

- ESLint configuration in `eslint.config.js`
- React best practices
- Functional components with hooks
- Consistent naming conventions

## 🤝 Contributing

1. Follow the existing code structure
2. Maintain consistent styling
3. Add proper error handling
4. Test all user flows
5. Update documentation as needed

## 📞 Support

For issues or questions:
- Check the backend API documentation
- Review module-specific documentation
- Check browser console for errors
- Verify API endpoints are working

## 📄 License

This project is part of an academic/educational car rental system.

## 👥 Contributors

- Member 1: Authentication & Core Setup
- Member 2: Vehicle & Vendor Module
- Member 3: Booking & Payment Module
- Member 4: Admin, Reviews & Complaints Module

---

**Last Updated**: January 2026
