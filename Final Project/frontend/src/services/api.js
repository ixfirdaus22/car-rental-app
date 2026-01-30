import axios from "axios";

// Base URL for your Spring Boot Backend
const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API Functions ---

// Auth
export const signup = (userData) => api.post("/auth/register", userData);
export const login = (loginData) => api.post("/auth/login", loginData);

// Users
export const getMyProfile = () => api.get("/users/profile");
export const updateProfile = (userData) => api.put("/auth/profile", userData);
export const deleteProfile = () => api.delete("/auth/profile");

// Cars (For Admin & Customer)
export const getAllCars = () => api.get("/cars");

// Vehicles (Vendor & User APIs)
export const getAllAvailableVehicles = () => api.get("/vehicles");
export const getVehicleById = (id) => api.get(`/vehicles/${id}`);
export const getVendorVehicles = () => api.get("/vehicles/vendor");
export const addVehicle = (vehicleData) => api.post("/vehicles", vehicleData);
export const updateVehicle = (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
export const updateVehicleStatus = (id, statusData) => api.put(`/vehicles/${id}/status`, statusData);

// Bookings
export const createBooking = (bookingData) => api.post("/bookings", bookingData);
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const getUserBookings = () => api.get("/bookings/user");
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const getVendorBookings = () => api.get("/bookings/vendor");

// Payments
export const createPayment = (paymentData) => api.post("/payments", paymentData);
export const getPaymentByBookingId = (bookingId) => api.get(`/payments/${bookingId}`);
export const updatePaymentStatus = (id, statusData) => api.put(`/payments/${id}/status`, statusData);

// Admin APIs
export const getAdminStats = () => api.get("/admin/stats");
export const getAllUsers = () => api.get("/admin/users");
export const getPendingUsers = () => api.get("/admin/users/pending");
export const approveUser = (userId) => api.put(`/admin/users/${userId}/approve`);
export const rejectUser = (userId) => api.put(`/admin/users/${userId}/reject`);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const getAllBookings = () => api.get("/admin/bookings");
export const getAllPayments = () => api.get("/admin/payments");
export const getAllVehicles = () => api.get("/admin/vehicles");

// Reports APIs
export const getRevenueReport = (period = 'year') => api.get(`/admin/reports/revenue?period=${period}`);
export const getBookingAnalytics = () => api.get("/admin/reports/bookings");
export const getVehiclePerformance = () => api.get("/admin/reports/vehicles");
export const getUserAnalytics = () => api.get("/admin/reports/users");

// Reviews APIs
export const createReview = (reviewData) => api.post("/reviews", reviewData);
export const getReviewsByVehicleId = (vehicleId) => api.get(`/reviews/vehicle/${vehicleId}`);
export const approveReview = (reviewId) => api.put(`/reviews/${reviewId}/approve`);
export const rejectReview = (reviewId) => api.put(`/reviews/${reviewId}/reject`);

// Complaints APIs
export const createComplaint = (complaintData) => api.post("/complaints", complaintData);
export const getUserComplaints = () => api.get("/complaints/user");
export const getAllComplaints = () => api.get("/complaints");
export const resolveComplaint = (complaintId, resolutionData) => api.put(`/complaints/${complaintId}/resolve`, resolutionData);

export default api;