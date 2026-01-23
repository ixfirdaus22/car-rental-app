-- Create & Use Database
CREATE DATABASE IF NOT EXISTS car_rental_db;
USE car_rental_db;

--1️⃣ users table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('CUSTOMER','HOST','ADMIN') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ CAR TABLE (Owned by Host, Approved by Admin)
CREATE TABLE cars (
    car_id              INT AUTO_INCREMENT PRIMARY KEY,
    host_id             INT NOT NULL,
    brand               VARCHAR(50) NOT NULL,
    model               VARCHAR(50) NOT NULL,
    car_type             ENUM('SUV', 'SEDAN', 'HATCHBACK') NOT NULL,
    fuel_type            ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'CNG') NOT NULL,
    transmission         ENUM('MANUAL', 'AUTOMATIC') NOT NULL,
    price_per_day        DECIMAL(10,2) NOT NULL,
    location             VARCHAR(100) NOT NULL,
    availability_status  BOOLEAN DEFAULT TRUE,
    is_approved          BOOLEAN DEFAULT FALSE,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_car_host
        FOREIGN KEY (host_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 3️⃣ BOOKING TABLE (Customer ↔ Car)
CREATE TABLE bookings (
    booking_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    car_id          INT NOT NULL,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    total_amount    DECIMAL(10,2) NOT NULL,
    booking_status  ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_booking_car
        FOREIGN KEY (car_id)
        REFERENCES cars(car_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_dates
        CHECK (end_date >= start_date)
);

-- 4️⃣ PAYMENT TABLE (One Booking → One Payment)
CREATE TABLE payments (
    payment_id        INT AUTO_INCREMENT PRIMARY KEY,
    booking_id        INT NOT NULL UNIQUE,
    amount            DECIMAL(10,2) NOT NULL,
    payment_method    ENUM('UPI', 'CARD', 'NET_BANKING', 'WALLET') NOT NULL,
    payment_status    ENUM('SUCCESS', 'FAILED', 'REFUNDED') NOT NULL,
    transaction_ref   VARCHAR(100) UNIQUE,
    payment_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE
);

--5️⃣ CAR AVAILABILITY TABLE (Prevents Double Booking)
CREATE TABLE car_availability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id          INT NOT NULL,
    available_date  DATE NOT NULL,
    is_available    BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_availability_car
        FOREIGN KEY (car_id)
        REFERENCES cars(car_id)
        ON DELETE CASCADE,

    UNIQUE (car_id, available_date)
);

-- 6️⃣ REVIEW TABLE (Optional but Impressive)
CREATE TABLE reviews (
    review_id     INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    car_id        INT NOT NULL,
    rating        INT CHECK (rating BETWEEN 1 AND 5),
    comment       VARCHAR(255),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_car
        FOREIGN KEY (car_id)
        REFERENCES cars(car_id)
        ON DELETE CASCADE
);

--7️⃣ ADMIN ACTION / AUDIT LOG (Bonus)
CREATE TABLE admin_actions (
    action_id      INT AUTO_INCREMENT PRIMARY KEY,
    admin_id       INT NOT NULL,
    action_type    VARCHAR(100) NOT NULL,
    target_entity  VARCHAR(50),
    action_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_action
        FOREIGN KEY (admin_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);