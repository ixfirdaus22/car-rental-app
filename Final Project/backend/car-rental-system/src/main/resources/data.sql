-- Create the database if it doesn't exist (useful if running in MySQL directly)
CREATE DATABASE IF NOT EXISTS car_rental_db1;
USE car_rental_db1;

-- =================================================================================================
-- USERS
-- Password for all users is: password (BCrypt hash: $2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG)
-- =================================================================================================
INSERT IGNORE INTO users (id, name, email, password_hash, phone_no, license_no, aadhar_no, role, gender, status) VALUES
(1, 'Admin User', 'admin@example.com', '$2b$10$W2Nsd6vvYb4a2Dqq6lu7zexmlINGM/1z7UijG00ySS09EvKuk2DV8e', '9876543210', 'ADM12345', '123412341234', 'ADMIN', 'MALE', 'APPROVED'),
(8, 'New Admin', 'admin2@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG', '9876543299', 'ADM99999', '123412341299', 'ADMIN', 'MALE', 'APPROVED'),
(2, 'Vendor Bob', 'vendor@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG', '9876543211', 'VEN12345', '123412341235', 'VENDOR', 'MALE', 'APPROVED'),
(3, 'Customer Alice', 'customer@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG', '9876543212', 'CUS12345', '123412341236', 'CUSTOMER', 'FEMALE', 'APPROVED'),
(4, 'Vendor Sarah', 'sarah@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG', '9876543213', 'VEN54321', '123412341237', 'VENDOR', 'FEMALE', 'APPROVED'),
(5, 'Vendor Mike', 'mike@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG', '9876543214', 'VEN67890', '123412341238', 'VENDOR', 'MALE', 'APPROVED'),
(6, 'Customer John', 'john@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG', '9876543215', 'CUS67890', '123412341239', 'CUSTOMER', 'MALE', 'APPROVED'),
(7, 'Customer Emma', 'emma@example.com', '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG', '9876543216', 'CUS11223', '123412341240', 'CUSTOMER', 'FEMALE', 'APPROVED');

-- Force update admin password to 'password' (known working hash) to ensure access
UPDATE users SET password_hash = '$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlNBxBFveB.qLG' WHERE email = 'admin@example.com';

-- =================================================================================================
-- VEHICLES
-- Assinged to Vendors (ID 2, 4, 5)
-- =================================================================================================
INSERT IGNORE INTO vehicles (id, make, manufacturer, model, year, color, license_plate, vin, price_per_day, status, fuel_type, transmission, seating_capacity, description, image_url, vendor_id, created_at, updated_at) VALUES
-- Vendor Bob (ID 2)
(1, 'Toyota', 'Toyota', 'Camry', 2023, 'Silver', 'MH12AB1234', 'VIN1234567890', 2500.00, 'AVAILABLE', 'PETROL', 'AUTOMATIC', 5, 'Comfortable sedan for city drives.', 'Camry.jpg', 2, NOW(), NOW()),
(2, 'Honda', 'Honda', 'City', 2022, 'White', 'MH12AB5678', 'VIN0987654321', 2000.00, 'AVAILABLE', 'PETROL', 'MANUAL', 5, 'Reliable and fuel efficient.', 'City.jpg', 2, NOW(), NOW()),
(3, 'Hyundai', 'Hyundai', 'Creta', 2023, 'Black', 'MH14CD1234', 'VIN1122334455', 3000.00, 'AVAILABLE', 'DIESEL', 'AUTOMATIC', 5, 'Spacious SUV perfect for trips.', 'creta.jpg', 2, NOW(), NOW()),
(4, 'Mahindra', 'Mahindra', 'XUV700', 2024, 'Midnight Black', 'MH12EF9012', 'VIN6677889900', 4500.00, 'AVAILABLE', 'DIESEL', 'AUTOMATIC', 7, 'Luxury SUV with advanced features.', 'XUV.jpg', 2, NOW(), NOW()),
(5, 'Tata', 'Tata', 'Nexon', 2023, 'Blue', 'MH12GH3456', 'VIN5544332211', 2200.00, 'AVAILABLE', 'PETROL', 'MANUAL', 5, 'Safety rated 5 stars compact SUV.', 'Nexon.jpg', 2, NOW(), NOW()),
-- Vendor Sarah (ID 4)
(6, 'Maruti Suzuki', 'Maruti', 'Swift', 2023, 'Red', 'MH02XY1111', 'VIN9988776655', 1800.00, 'AVAILABLE', 'PETROL', 'MANUAL', 5, 'Perfect hatchback for city traffic.', 'Swift.jpg', 4, NOW(), NOW()),
(7, 'Kia', 'Kia', 'Seltos', 2023, 'Grey', 'MH02XY2222', 'VIN9988776644', 2800.00, 'AVAILABLE', 'DIESEL', 'AUTOMATIC', 5, 'Stylish SUV with premium interiors.', 'Seltos.jpg', 4, NOW(), NOW()),
(8, 'Toyota', 'Toyota', 'Innova Crysta', 2022, 'Bronze', 'MH02XY3333', 'VIN9988776633', 3500.00, 'AVAILABLE', 'DIESEL', 'MANUAL', 7, 'Best in class comfort for long journeys.', 'Innova.jpg', 4, NOW(), NOW()),
(9, 'BMW', 'BMW', '3 Series', 2023, 'White', 'MH01AB9999', 'VIN1231231234', 8000.00, 'AVAILABLE', 'PETROL', 'AUTOMATIC', 5, 'Experience luxury and performance.', 'BMW3.jpg', 4, NOW(), NOW()),
-- Vendor Mike (ID 5)
(10, 'Mercedes', 'Mercedes', 'C-Class', 2023, 'Black', 'MH01CD8888', 'VIN1231231235', 8500.00, 'AVAILABLE', 'DIESEL', 'AUTOMATIC', 5, 'Classy and elegant sedan.', 'BenzC.jpg', 5, NOW(), NOW()),
(11, 'Audi', 'Audi', 'A4', 2023, 'Silver', 'MH01EF7777', 'VIN1231231236', 7800.00, 'AVAILABLE', 'PETROL', 'AUTOMATIC', 5, 'Technologically advanced luxury car.', 'AudiA4.jpg', 5, NOW(), NOW()),
(12, 'Mahindra', 'Mahindra', 'Thar', 2023, 'Red', 'MH12JK5678', 'VIN5566778899', 3200.00, 'AVAILABLE', 'DIESEL', 'MANUAL', 4, 'The ultimate off-road experience.', 'Thar.jpg', 5, NOW(), NOW()),
(13, 'Tata', 'Tata', 'Harrier', 2023, 'Dark Edition', 'MH12LM9012', 'VIN4433221100', 3100.00, 'BOOKED', 'DIESEL', 'AUTOMATIC', 5, 'Bold and powerful SUV.', 'Harrier.jpg', 5, NOW(), NOW());

-- =================================================================================================
-- BOOKINGS
-- =================================================================================================
INSERT IGNORE INTO bookings (id, user_id, vehicle_id, pickup_date, return_date, pickup_location, return_location, total_amount, status, created_at, updated_at) VALUES
(1, 3, 1, '2023-11-01', '2023-11-05', 'Mumbai Airport', 'Mumbai Airport', 10000.00, 'COMPLETED', NOW(), NOW()),
(2, 6, 3, '2023-12-10', '2023-12-12', 'Pune Station', 'Pune Station', 6000.00, 'COMPLETED', NOW(), NOW()),
(3, 7, 13, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Mumbai', 'Goa', 9300.00, 'CONFIRMED', NOW(), NOW()), -- Current active booking matches vehicle 13 status
(4, 3, 6, DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Delhi', 'Delhi', 3600.00, 'PENDING', NOW(), NOW());

-- =================================================================================================
-- PAYMENTS
-- =================================================================================================
INSERT IGNORE INTO payments (id, booking_id, amount, payment_method, status, transaction_id, payment_date, created_at, updated_at) VALUES
(1, 1, 10000.00, 'CREDIT_CARD', 'COMPLETED', 'TXN123456789', '2023-11-01 10:00:00', NOW(), NOW()),
(2, 2, 6000.00, 'UPI', 'COMPLETED', 'TXN987654321', '2023-12-10 09:30:00', NOW(), NOW()),
(3, 3, 9300.00, 'DEBIT_CARD', 'COMPLETED', 'TXN456123789', NOW(), NOW(), NOW());

-- =================================================================================================
-- REVIEWS
-- =================================================================================================
INSERT IGNORE INTO reviews (id, user_id, vehicle_id, rating, comment, status, created_at, updated_at) VALUES
(1, 3, 1, 5, 'The Camry was in excellent condition and very clean!', 'APPROVED', NOW(), NOW()),
(2, 6, 3, 4, 'Good car, but the pickup process took a bit long.', 'APPROVED', NOW(), NOW()),
(3, 6, 1, 5, 'Loved the drive, very smooth.', 'PENDING', NOW(), NOW());

-- =================================================================================================
-- COMPLAINTS
-- =================================================================================================
INSERT IGNORE INTO complaints (id, user_id, booking_id, subject, description, status, created_at, updated_at) VALUES
(1, 3, 1, 'Dirty Seats', 'The back seats had some stains when I picked up the car.', 'RESOLVED', NOW(), NOW()),
(2, 6, 2, 'Delay in Refund', 'I am still waiting for the security deposit refund.', 'PENDING', NOW(), NOW());
