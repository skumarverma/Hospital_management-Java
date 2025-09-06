// Hospital Management System Frontend JavaScript

class HospitalManagementSystem {
    constructor() {
        this.patients = [];
        this.doctors = [];
        this.appointments = [];
        this.nextPatientId = 1;
        this.nextDoctorId = 1;
        this.nextAppointmentId = 1;
        this.init();
        this.loadSampleData();
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.setupEventListeners();
        this.setupModal();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetSection = button.getAttribute('data-section');
                
                // Remove active class from all buttons and sections
                navButtons.forEach(btn => btn.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked button and corresponding section
                button.classList.add('active');
                document.getElementById(targetSection).classList.add('active');

                // Refresh data when switching to view sections
                if (targetSection === 'view-patients') {
                    this.displayPatients();
                } else if (targetSection === 'view-doctors') {
                    this.displayDoctors();
                } else if (targetSection === 'view-appointments') {
                    this.displayAppointments();
                }
            });
        });
    }

    setupForms() {
        // Add Patient Form
        document.getElementById('addPatientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPatient();
        });

        // Book Appointment Form
        document.getElementById('bookAppointmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.bookAppointment();
        });

        // Real-time patient/doctor info lookup
        document.getElementById('appointmentPatientId').addEventListener('input', (e) => {
            this.lookupPatientInfo(e.target.value);
        });

        document.getElementById('appointmentDoctorId').addEventListener('input', (e) => {
            this.lookupDoctorInfo(e.target.value);
        });
    }

    setupEventListeners() {
        // Refresh buttons
        document.getElementById('refreshPatientsBtn').addEventListener('click', () => {
            this.displayPatients();
            this.showMessage('Patient records refreshed!', 'success');
        });

        document.getElementById('refreshDoctorsBtn').addEventListener('click', () => {
            this.displayDoctors();
            this.showMessage('Doctor records refreshed!', 'success');
        });

        document.getElementById('refreshAppointmentsBtn').addEventListener('click', () => {
            this.displayAppointments();
            this.showMessage('Appointment schedule refreshed!', 'success');
        });

        // Search functionality
        document.getElementById('patientSearch').addEventListener('input', (e) => {
            this.filterPatients(e.target.value);
        });

        document.getElementById('doctorSearch').addEventListener('input', (e) => {
            this.filterDoctors(e.target.value);
        });

        // Appointment filters
        document.getElementById('appointmentDateFilter').addEventListener('change', () => {
            this.filterAppointments();
        });

        document.getElementById('appointmentStatusFilter').addEventListener('change', () => {
            this.filterAppointments();
        });

        // Set minimum date for appointments to today
        document.getElementById('appointmentDate').min = new Date().toISOString().split('T')[0];
    }

    setupModal() {
        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    loadSampleData() {
        // Load sample doctors
        this.doctors = [
            {
                id: 1,
                name: 'Dr. Sarah Johnson',
                specialization: 'Cardiology',
                phone: '+1-555-0101',
                email: 'sarah.johnson@hospital.com',
                status: 'Available'
            },
            {
                id: 2,
                name: 'Dr. Michael Chen',
                specialization: 'Neurology',
                phone: '+1-555-0102',
                email: 'michael.chen@hospital.com',
                status: 'Available'
            },
            {
                id: 3,
                name: 'Dr. Emily Davis',
                specialization: 'Pediatrics',
                phone: '+1-555-0103',
                email: 'emily.davis@hospital.com',
                status: 'Busy'
            },
            {
                id: 4,
                name: 'Dr. Robert Wilson',
                specialization: 'Orthopedics',
                phone: '+1-555-0104',
                email: 'robert.wilson@hospital.com',
                status: 'Available'
            },
            {
                id: 5,
                name: 'Dr. Lisa Anderson',
                specialization: 'Dermatology',
                phone: '+1-555-0105',
                email: 'lisa.anderson@hospital.com',
                status: 'Available'
            }
        ];

        // Load sample patients
        this.patients = [
            {
                id: 1,
                name: 'John Smith',
                age: 35,
                gender: 'Male',
                phone: '+1-555-1001',
                address: '123 Main St, Anytown, ST 12345'
            },
            {
                id: 2,
                name: 'Maria Garcia',
                age: 28,
                gender: 'Female',
                phone: '+1-555-1002',
                address: '456 Oak Ave, Anytown, ST 12345'
            },
            {
                id: 3,
                name: 'David Johnson',
                age: 42,
                gender: 'Male',
                phone: '+1-555-1003',
                address: '789 Pine Rd, Anytown, ST 12345'
            }
        ];

        // Load sample appointments
        this.appointments = [
            {
                id: 1,
                patientId: 1,
                doctorId: 1,
                date: '2024-01-15',
                time: '10:00',
                reason: 'Regular checkup',
                status: 'scheduled'
            },
            {
                id: 2,
                patientId: 2,
                doctorId: 3,
                date: '2024-01-16',
                time: '14:30',
                reason: 'Skin rash consultation',
                status: 'scheduled'
            }
        ];

        // Update counters
        this.nextPatientId = Math.max(...this.patients.map(p => p.id), 0) + 1;
        this.nextDoctorId = Math.max(...this.doctors.map(d => d.id), 0) + 1;
        this.nextAppointmentId = Math.max(...this.appointments.map(a => a.id), 0) + 1;

        // Display initial data
        this.displayPatients();
        this.displayDoctors();
        this.displayAppointments();
    }

    addPatient() {
        const form = document.getElementById('addPatientForm');
        const formData = new FormData(form);
        
        const patient = {
            id: this.nextPatientId++,
            name: formData.get('patientName').trim(),
            age: parseInt(formData.get('patientAge')),
            gender: formData.get('patientGender'),
            phone: formData.get('patientPhone').trim(),
            address: formData.get('patientAddress').trim()
        };

        // Validation
        if (!patient.name || !patient.age || !patient.gender || !patient.phone || !patient.address) {
            this.showMessage('Please fill in all fields!', 'error');
            return;
        }

        if (patient.age < 1 || patient.age > 120) {
            this.showMessage('Please enter a valid age (1-120)!', 'error');
            return;
        }

        // Check for duplicate phone numbers
        const existingPatient = this.patients.find(p => p.phone === patient.phone);
        if (existingPatient) {
            this.showMessage(`Phone number already exists for patient: ${existingPatient.name}`, 'error');
            return;
        }

        this.patients.push(patient);
        this.showMessage(`Patient ${patient.name} added successfully! Patient ID: ${patient.id}`, 'success');
        
        // Clear form
        form.reset();
        
        // Update display if on patients view
        this.displayPatients();
    }

    bookAppointment() {
        const form = document.getElementById('bookAppointmentForm');
        const formData = new FormData(form);
        
        const appointment = {
            id: this.nextAppointmentId++,
            patientId: parseInt(formData.get('appointmentPatientId')),
            doctorId: parseInt(formData.get('appointmentDoctorId')),
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            reason: formData.get('appointmentReason').trim() || 'General consultation',
            status: 'scheduled'
        };

        // Validation
        if (!appointment.patientId || !appointment.doctorId || !appointment.date || !appointment.time) {
            this.showMessage('Please fill in all required fields!', 'error');
            return;
        }

        // Check if patient exists
        const patient = this.patients.find(p => p.id === appointment.patientId);
        if (!patient) {
            this.showMessage(`Patient with ID ${appointment.patientId} not found!`, 'error');
            return;
        }

        // Check if doctor exists
        const doctor = this.doctors.find(d => d.id === appointment.doctorId);
        if (!doctor) {
            this.showMessage(`Doctor with ID ${appointment.doctorId} not found!`, 'error');
            return;
        }

        // Check doctor availability
        if (!this.checkDoctorAvailability(appointment.doctorId, appointment.date)) {
            this.showMessage(`Dr. ${doctor.name} is not available on ${appointment.date}!`, 'error');
            return;
        }

        // Check for appointment conflicts
        const conflictingAppointment = this.appointments.find(a => 
            a.doctorId === appointment.doctorId && 
            a.date === appointment.date && 
            a.time === appointment.time &&
            a.status === 'scheduled'
        );

        if (conflictingAppointment) {
            this.showMessage(`Time slot ${appointment.time} on ${appointment.date} is already booked for Dr. ${doctor.name}!`, 'error');
            return;
        }

        this.appointments.push(appointment);
        this.showMessage(`Appointment booked successfully! 
            Patient: ${patient.name} 
            Doctor: Dr. ${doctor.name} 
            Date: ${appointment.date} at ${appointment.time}`, 'success');
        
        // Clear form
        form.reset();
        document.getElementById('patientDoctorInfo').style.display = 'none';
        
        // Update display
        this.displayAppointments();
    }

    checkDoctorAvailability(doctorId, date) {
        const doctor = this.doctors.find(d => d.id === doctorId);
        if (!doctor) return false;
        
        // Check if doctor status is available
        if (doctor.status !== 'Available') return false;
        
        // Check if the date is not in the past
        const appointmentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return appointmentDate >= today;
    }

    lookupPatientInfo(patientId) {
        const patient = this.patients.find(p => p.id === parseInt(patientId));
        const patientInfo = document.getElementById('patientInfo');
        const infoPanel = document.getElementById('patientDoctorInfo');
        
        if (patient) {
            patientInfo.innerHTML = `
                <p><strong>Name:</strong> ${patient.name}</p>
                <p><strong>Age:</strong> ${patient.age}</p>
                <p><strong>Gender:</strong> ${patient.gender}</p>
                <p><strong>Phone:</strong> ${patient.phone}</p>
            `;
            infoPanel.style.display = 'block';
        } else if (patientId) {
            patientInfo.innerHTML = '<p style="color: #e17055;">Patient not found</p>';
            infoPanel.style.display = 'block';
        } else {
            infoPanel.style.display = 'none';
        }
    }

    lookupDoctorInfo(doctorId) {
        const doctor = this.doctors.find(d => d.id === parseInt(doctorId));
        const doctorInfo = document.getElementById('doctorInfo');
        const infoPanel = document.getElementById('patientDoctorInfo');
        
        if (doctor) {
            doctorInfo.innerHTML = `
                <p><strong>Name:</strong> Dr. ${doctor.name}</p>
                <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                <p><strong>Phone:</strong> ${doctor.phone}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${doctor.status.toLowerCase()}">${doctor.status}</span></p>
            `;
            infoPanel.style.display = 'block';
        } else if (doctorId) {
            doctorInfo.innerHTML = '<p style="color: #e17055;">Doctor not found</p>';
            infoPanel.style.display = 'block';
        } else {
            infoPanel.style.display = 'none';
        }
    }

    displayPatients(filteredPatients = null) {
        const tbody = document.getElementById('patientsBody');
        const patients = filteredPatients || this.patients;
        
        if (patients.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #666; font-style: italic;">
                        No patients found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = patients.map(patient => `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>
                <td>${patient.address}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-small btn-warning" onclick="hospitalSystem.editPatient(${patient.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-small btn-danger" onclick="hospitalSystem.deletePatient(${patient.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    displayDoctors(filteredDoctors = null) {
        const tbody = document.getElementById('doctorsBody');
        const doctors = filteredDoctors || this.doctors;
        
        if (doctors.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #666; font-style: italic;">
                        No doctors found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = doctors.map(doctor => `
            <tr>
                <td>${doctor.id}</td>
                <td>Dr. ${doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.phone}</td>
                <td>${doctor.email}</td>
                <td><span class="status-badge status-${doctor.status.toLowerCase()}">${doctor.status}</span></td>
            </tr>
        `).join('');
    }

    displayAppointments(filteredAppointments = null) {
        const tbody = document.getElementById('appointmentsBody');
        const appointments = filteredAppointments || this.appointments;
        
        if (appointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; color: #666; font-style: italic;">
                        No appointments found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = appointments.map(appointment => {
            const patient = this.patients.find(p => p.id === appointment.patientId);
            const doctor = this.doctors.find(d => d.id === appointment.doctorId);
            
            return `
                <tr>
                    <td>${appointment.id}</td>
                    <td>${patient ? patient.name : 'Unknown Patient'}</td>
                    <td>Dr. ${doctor ? doctor.name : 'Unknown Doctor'}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td>${appointment.reason}</td>
                    <td><span class="status-badge status-${appointment.status}">${appointment.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${appointment.status === 'scheduled' ? `
                                <button class="btn btn-small btn-success" onclick="hospitalSystem.completeAppointment(${appointment.id})">
                                    <i class="fas fa-check"></i> Complete
                                </button>
                                <button class="btn btn-small btn-danger" onclick="hospitalSystem.cancelAppointment(${appointment.id})">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    filterPatients(searchTerm) {
        if (!searchTerm.trim()) {
            this.displayPatients();
            return;
        }

        const filtered = this.patients.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm) ||
            patient.id.toString().includes(searchTerm)
        );

        this.displayPatients(filtered);
    }

    filterDoctors(searchTerm) {
        if (!searchTerm.trim()) {
            this.displayDoctors();
            return;
        }

        const filtered = this.doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.id.toString().includes(searchTerm)
        );

        this.displayDoctors(filtered);
    }

    filterAppointments() {
        const dateFilter = document.getElementById('appointmentDateFilter').value;
        const statusFilter = document.getElementById('appointmentStatusFilter').value;

        let filtered = this.appointments;

        if (dateFilter) {
            filtered = filtered.filter(appointment => appointment.date === dateFilter);
        }

        if (statusFilter) {
            filtered = filtered.filter(appointment => appointment.status === statusFilter);
        }

        this.displayAppointments(filtered);
    }

    editPatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>Edit Patient</h2>
            <form id="editPatientForm" class="form">
                <div class="form-group">
                    <label for="editPatientName">Patient Name</label>
                    <input type="text" id="editPatientName" name="editPatientName" value="${patient.name}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editPatientAge">Age</label>
                        <input type="number" id="editPatientAge" name="editPatientAge" value="${patient.age}" min="1" max="120" required>
                    </div>
                    <div class="form-group">
                        <label for="editPatientGender">Gender</label>
                        <select id="editPatientGender" name="editPatientGender" required>
                            <option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Other" ${patient.gender === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editPatientPhone">Phone Number</label>
                    <input type="tel" id="editPatientPhone" name="editPatientPhone" value="${patient.phone}" required>
                </div>
                <div class="form-group">
                    <label for="editPatientAddress">Address</label>
                    <textarea id="editPatientAddress" name="editPatientAddress" rows="3" required>${patient.address}</textarea>
                </div>
                <div class="action-buttons">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Update Patient
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal').style.display='none'">
                        Cancel
                    </button>
                </div>
            </form>
        `;

        document.getElementById('modal').style.display = 'block';

        document.getElementById('editPatientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePatient(patientId, new FormData(e.target));
        });
    }

    updatePatient(patientId, formData) {
        const patientIndex = this.patients.findIndex(p => p.id === patientId);
        if (patientIndex === -1) return;

        const updatedPatient = {
            ...this.patients[patientIndex],
            name: formData.get('editPatientName').trim(),
            age: parseInt(formData.get('editPatientAge')),
            gender: formData.get('editPatientGender'),
            phone: formData.get('editPatientPhone').trim(),
            address: formData.get('editPatientAddress').trim()
        };

        // Check for duplicate phone numbers (excluding current patient)
        const existingPatient = this.patients.find(p => p.phone === updatedPatient.phone && p.id !== patientId);
        if (existingPatient) {
            this.showMessage(`Phone number already exists for patient: ${existingPatient.name}`, 'error');
            return;
        }

        this.patients[patientIndex] = updatedPatient;
        this.showMessage(`Patient ${updatedPatient.name} updated successfully!`, 'success');
        
        document.getElementById('modal').style.display = 'none';
        this.displayPatients();
    }

    deletePatient(patientId) {
        const patient = this.patients.find(p => p.id === patientId);
        if (!patient) return;

        if (confirm(`Are you sure you want to delete patient ${patient.name}? This action cannot be undone.`)) {
            // Check for existing appointments
            const hasAppointments = this.appointments.some(a => a.patientId === patientId && a.status === 'scheduled');
            if (hasAppointments) {
                this.showMessage(`Cannot delete patient ${patient.name}. Patient has scheduled appointments.`, 'error');
                return;
            }

            this.patients = this.patients.filter(p => p.id !== patientId);
            this.showMessage(`Patient ${patient.name} deleted successfully!`, 'success');
            this.displayPatients();
        }
    }

    completeAppointment(appointmentId) {
        const appointmentIndex = this.appointments.findIndex(a => a.id === appointmentId);
        if (appointmentIndex === -1) return;

        this.appointments[appointmentIndex].status = 'completed';
        this.showMessage('Appointment marked as completed!', 'success');
        this.displayAppointments();
    }

    cancelAppointment(appointmentId) {
        const appointment = this.appointments.find(a => a.id === appointmentId);
        if (!appointment) return;

        const patient = this.patients.find(p => p.id === appointment.patientId);
        const doctor = this.doctors.find(d => d.id === appointment.doctorId);

        if (confirm(`Are you sure you want to cancel the appointment for ${patient?.name} with Dr. ${doctor?.name} on ${appointment.date}?`)) {
            const appointmentIndex = this.appointments.findIndex(a => a.id === appointmentId);
            this.appointments[appointmentIndex].status = 'cancelled';
            this.showMessage('Appointment cancelled successfully!', 'success');
            this.displayAppointments();
        }
    }

    showMessage(message, type = 'info') {
        const messageContainer = document.getElementById('messageContainer');
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                         type === 'error' ? 'fa-times-circle' : 
                         type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        messageContainer.appendChild(messageElement);
        
        // Auto remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
let hospitalSystem;
document.addEventListener('DOMContentLoaded', () => {
    hospitalSystem = new HospitalManagementSystem();
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatTime(timeString) {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}