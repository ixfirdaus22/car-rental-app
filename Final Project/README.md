# Car Rental System

A complete car rental platform enabling customers to browse, book, and pay for vehicles, while vendors manage their fleet and admins oversee the entire operation.

## 🚀 Quick Start

### Prerequisites
- **Frontend**: Node.js (v18+)
- **Backend**: Java JDK 21+, Maven
- **Database**: MySQL 8.0+

### 1. Database Setup
Create a MySQL database named `car_rental_db`.
```sql
CREATE DATABASE car_rental_db;
```

### 2. Backend Setup
Navigate to the backend directory and run the Spring Boot application.
```bash
cd backend/car-rental-system
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the dev server.
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## 🏗 Architecture

The project is built using a modern decoupled architecture:

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Bootstrap 5 + Custom CSS
- **State Management**: React Context API
- **Routing**: React Router DOM

### Backend
- **Framework**: Spring Boot 3
- **Security**: Spring Security + JWT
- **ORM**: Hibernate / Spring Data JPA
- **Database**: MySQL
- **Build Tool**: Maven

---

## 🔑 Key Features

- **User Roles**: 
  - **Customer**: Browse cars, book with dynamic pricing, pay via UPI, manage bookings.
  - **Vendor**: Add/manage vehicles, track bookings and revenue.
  - **Admin**: Approve users/reviews, view analytics (revenue, bookings), manage complaints.
- **Dynamic Pricing**: Calculates cost based on duration, including long-term discounts and taxes.
- **Real-time Availability**: Prevents double bookings with conflict detection algorithms.
- **Secure Authentication**: JWT-based login and registration with role-based access control.

---

## 📚 API Documentation

For detailed backend API documentation, please refer to the [Backend README](backend/car-rental-system/README.md).

### Quick API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authenticate user & get JWT |
| `/api/cars` | GET | Fetch available cars |
| `/api/bookings/calculate` | POST | Get price breakdown (Base + Tax - Discount) |
| `/api/bookings` | POST | Create a new booking |

---

## 📂 Project Structure

```
├── backend/               # Spring Boot Application
│   ├── src/main/java/     # Source code (Controllers, Services, Repos)
│   └── pom.xml            # Maven dependencies
└── frontend/              # React Application
    ├── src/               # Components, Pages, Context
    └── package.json       # Node dependencies
```
