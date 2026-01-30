import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import BlankLayout from './layouts/BlankLayout'
import AdminLayout from './layouts/AdminLayout'
import VendorLayout from './layouts/VendorLayout'
import HomePage from './pages/Home/HomePage'
import CarsPage from './pages/Cars/CarsPage'
import CarDetailsPage from './pages/Cars/CarDetailsPage'
import AboutPage from './pages/About/AboutPage'
import ContactPage from './pages/Contact/ContactPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import UserProfilePage from './pages/Profile/UserProfilePage'
import BookingsPage from './pages/Bookings/BookingsPage'
import PaymentPage from './pages/Payment/PaymentPage'
import ReviewsPage from './pages/Reviews/ReviewsPage'
import ComplaintsPage from './pages/Complaints/ComplaintsPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminCarsPage from './pages/Admin/AdminCarsPage'
import AdminBookingsPage from './pages/Admin/AdminBookingsPage'
import AdminUsersPage from './pages/Admin/AdminUsersPage'
import AdminReportsPage from './pages/Admin/AdminReportsPage'
import AdminSettingsPage from './pages/Admin/AdminSettingsPage'
import AdminReviewsPage from './pages/Admin/AdminReviewsPage'
import AdminComplaintsPage from './pages/Admin/AdminComplaintsPage'
import UserRegistrationRequestsPage from './pages/Admin/UserRegistrationRequestsPage'
import VendorDashboard from './pages/Vendor/VendorDashboard'
import VendorBookings from './pages/Vendor/VendorBookings'
import VendorCars from './pages/Vendor/VendorCars'
import VendorRevenue from './pages/Vendor/VendorRevenue'
import VendorSettings from './pages/Vendor/VendorSettings'

function App() {
  return (
    <Routes>
      {/* Routes with Header and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/car/:carId" element={<CarDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
      </Route>

      {/* Routes without Header and Footer (Auth pages) */}
      <Route element={<BlankLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/cars" element={<AdminCarsPage />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/users/registration-requests" element={<UserRegistrationRequestsPage />} />
        <Route path="/admin/reviews" element={<AdminReviewsPage />} />
        <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Vendor Routes */}
      <Route element={<VendorLayout />}>
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/cars" element={<VendorCars />} />
        <Route path="/vendor/bookings" element={<VendorBookings />} />
        <Route path="/vendor/revenue" element={<VendorRevenue />} />
        <Route path="/vendor/settings" element={<VendorSettings />} />
      </Route>
    </Routes>
  )
}

export default App