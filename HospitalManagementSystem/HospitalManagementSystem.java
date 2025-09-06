package HospitalManagementSystem;
import java.sql.*;
import java.util.Scanner;

public class HospitalManagementSystem {
    private static String url = "jdbc:mysql://localhost:3306/hospital";
    private static String username = "root";
    private static String password = "23acbvkSs@";
    
    public static void main(String[] args) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        
        Scanner scanner = new Scanner(System.in);
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
            Patient patient = new Patient(connection, scanner);
            Doctor doctor = new Doctor(connection);
            
            while (true) {
                System.out.println();
                System.out.println("=================================");
                System.out.println("   HOSPITAL MANAGEMENT SYSTEM   ");
                System.out.println("=================================");
                System.out.println("1. Add Patient");
                System.out.println("2. View Patients");
                System.out.println("3. View Doctors");
                System.out.println("4. Book Appointment");
                System.out.println("5. View Appointments");
                System.out.println("6. Exit");
                System.out.println("=================================");
                System.out.print("Enter your choice: ");
                
                int choice = scanner.nextInt();
                
                switch (choice) {
                    case 1:
                        patient.addPatient();
                        System.out.println();
                        break;
                    case 2:
                        patient.viewPatients();
                        System.out.println();
                        break;
                    case 3:
                        doctor.viewDoctor();
                        System.out.println();
                        break;
                    case 4:
                        bookAppointment(patient, doctor, connection, scanner);
                        System.out.println();
                        break;
                    case 5:
                        viewAppointments(connection);
                        System.out.println();
                        break;
                    case 6:
                        System.out.println("THANK YOU FOR USING HOSPITAL MANAGEMENT SYSTEM!");
                        return;
                    default:
                        System.out.println("Invalid choice! Please try again.");
                        break;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            scanner.close();
        }
    }
    
    public static void bookAppointment(Patient patient, Doctor doctor, Connection connection, Scanner scanner) {
        System.out.print("Enter Patient ID: ");
        int patientId = scanner.nextInt();
        System.out.print("Enter Doctor ID: ");
        int doctorId = scanner.nextInt();
        System.out.print("Enter Appointment Date (YYYY-MM-DD): ");
        String appointmentDate = scanner.next();
        
        if (patient.getPatientById(patientId) && doctor.getDoctorById(doctorId)) {
            if (checkDoctorAvailability(doctorId, appointmentDate, connection)) {
                String appointmentQuery = "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)";
                
                try {
                    PreparedStatement preparedStatement = connection.prepareStatement(appointmentQuery);
                    preparedStatement.setInt(1, patientId);
                    preparedStatement.setInt(2, doctorId);
                    preparedStatement.setString(3, appointmentDate);
                    int rowsAffected = preparedStatement.executeUpdate();
                    
                    if (rowsAffected > 0) {
                        System.out.println("Appointment booked successfully!");
                    } else {
                        System.out.println("Failed to book appointment!");
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            } else {
                System.out.println("Doctor is not available on this date!");
            }
        } else {
            System.out.println("Either Patient or Doctor does not exist!");
        }
    }
    
    public static boolean checkDoctorAvailability(int doctorId, String appointmentDate, Connection connection) {
        String sql = "SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND appointment_date = ?";
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, doctorId);
            preparedStatement.setDate(2, java.sql.Date.valueOf(appointmentDate));
            
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                int count = resultSet.getInt(1);
                return count == 0; // Return true if no appointments found (doctor is available)
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    
    public static void viewAppointments(Connection connection) {
        String sql = "SELECT a.id, p.name AS patient_name, d.name AS doctor_name, a.appointment_date " +
                    "FROM appointments a " +
                    "JOIN patients p ON a.patient_id = p.id " +
                    "JOIN doctors d ON a.doctor_id = d.id " +
                    "ORDER BY a.appointment_date";
        
        try {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery(sql);
            
            System.out.println("Current Appointments:");
            System.out.println("+----+--------------------+--------------------+----------------+");
            System.out.println("| ID | Patient Name       | Doctor Name        | Appointment Date|");
            System.out.println("+----+--------------------+--------------------+----------------+");
            
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String patientName = resultSet.getString("patient_name");
                String doctorName = resultSet.getString("doctor_name");
                String appointmentDate = resultSet.getString("appointment_date");
                
                System.out.printf("| %-2d | %-18s | %-18s | %-14s |\n",
                        id, patientName, doctorName, appointmentDate);
            }
            System.out.println("+----+--------------------+--------------------+----------------+");
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}