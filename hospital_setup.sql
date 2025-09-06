-- Hospital Management System Database Setup

-- Create the database
CREATE DATABASE IF NOT EXISTS hospital;

-- Use the database
USE hospital;

-- Create the patients table
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL
);

-- Create the doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL
);

-- Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Insert sample doctors
INSERT INTO doctors (name, specialization) VALUES 
('Sarah Johnson', 'Cardiology'),
('Michael Chen', 'Neurology'),
('Emily Davis', 'Pediatrics'),
('Robert Wilson', 'Orthopedics'),
('Lisa Anderson', 'Dermatology'),
('James Brown', 'General Medicine'),
('Maria Garcia', 'Gynecology'),
('David Lee', 'Oncology');

-- Insert sample patients
INSERT INTO patients (name, age, gender) VALUES 
('John Smith', 35, 'Male'),
('Maria Garcia', 28, 'Female'),
('David Johnson', 42, 'Male'),
('Sarah Wilson', 31, 'Female'),
('Michael Brown', 55, 'Male');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES 
(1, 1, '2024-01-15'),
(2, 3, '2024-01-16'),
(3, 2, '2024-01-17'),
(4, 5, '2024-01-18'),
(5, 4, '2024-01-19');

-- Show the table structures
DESCRIBE patients;
DESCRIBE doctors;
DESCRIBE appointments;

-- Display sample data
SELECT 'PATIENTS' AS Table_Name;
SELECT * FROM patients;

SELECT 'DOCTORS' AS Table_Name;
SELECT * FROM doctors;

SELECT 'APPOINTMENTS' AS Table_Name;
SELECT a.id, p.name AS patient_name, d.name AS doctor_name, a.appointment_date 
FROM appointments a 
JOIN patients p ON a.patient_id = p.id 
JOIN doctors d ON a.doctor_id = d.id;