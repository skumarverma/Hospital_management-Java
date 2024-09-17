package HospitalManagementSystem;
import java.sql.*;

import javax.swing.*;
import java.util.Scanner;

public class HospitalManagementSystem {
    private static String url = "jdbc:mysql://localhost:3306/hospital";
    private static String username = "root";
    private static String password = "23acbvkSs@";
    public static void main(String[] args) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

        }catch (ClassNotFoundException e) {
            e.printStackTrace();

        }
        Scanner scanner = new Scanner(System.in);
        try {
            Connection connection = DriverManager.getConnection(url, username, password);
           Patient patient=new Patient(connection, scanner);
           Doctor doctor=new Doctor (connection);
           while (true)
           {
               System.out.println("HOSPITAL MANAGEMENT SYSTEM ");
               System.out.println("1. Add Patient");
               System.out.println("2. view Patient");
               System.out.println("3. view Doctor");
               System.out.println("4. book Appointment");
               System.out.println("5. Exit");
               System.out.println("Enter your choice");
               int choice = scanner.nextInt();
               switch (choice) {
                   case 1:
                       patient.addPatient();
                       System.out.println( );
                       break;
                       //add patient
                   case 2:
                       patient.viewpatients();
                       System.out.println( );
                       break;
                       //view Patient
                   case 3:
                       doctor.viewDoctor();
                       System.out.println( );
                       break;
                       //view Doctors
                   case 4:
                       //book Appointment
                       bookAppointment(patient,doctor,connection,scanner);
                       System.out.println( );
                       break;
                   case 5:
                       System.out.println("THANK YOU FOR USING HOSPITAL MANAGEMENT SYSTEM !!! ");
                       return;
                   default:
                       System.out.println("Invalid choice");
                       break;
               }

           }
        }catch(SQLException e){
            e.printStackTrace();
        }
    }
    public  static  void bookAppointment(Patient patient, Doctor doctor, Connection connection ,Scanner scanner){
        System.out.println("Enter Patient Id: ");
        int patientId = scanner.nextInt();
        System.out.println("Enter Doctor Id: ");
        int doctorId = scanner.nextInt();
        System.out.println("Enter Appointment Date(yyyy-MM-dd): )");
        String appointmentDate = scanner.next();
        if (patient.getPatientById(patientId) && doctor.getDoctorById(doctorId) )
        {
     if(checkDoctorAvailability(doctorId, appointmentDate,connection))
     {

         String appointmentQuery = "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)";

         try {
         PreparedStatement preparedStatement=connection.prepareStatement(appointmentQuery);
         preparedStatement.setInt(1,patientId);
         preparedStatement.setInt(2,doctorId);
         preparedStatement.setString(3, appointmentDate);
         int rowsAffected =preparedStatement.executeUpdate();
         if (rowsAffected>0)
         {
             System.out.println("Appointment Booked Successfully");
         }else
         {
             System.out.println("Appointment Booking Failed");
         }
     }catch (SQLException e)
     {
         e.printStackTrace();
     }
     }else {

         System.out.println("doctor does not exist on this date!!!!");
     }
        }else
        {
            System.out.println("Patient or doctor does not exist!!!");
        }
    }
    public static boolean checkDoctorAvailability(int doctor_id, String appointment_date ,Connection connection)
    {
        String sql="select count(*) from appointments where doctor_id=? and appointment_date=?";
        try {
            PreparedStatement preparedStatement =connection.prepareStatement(sql);
            preparedStatement.setInt(1,doctor_id);
            preparedStatement.setDate(2, java.sql.Date.valueOf(appointment_date));

            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next())
            {
                int count = resultSet.getInt(1);
                if (count == 0)
                {
                    return true;

                }else
                {
                    return false;
                }
            }
        }catch (SQLException e)
        {
            e.printStackTrace();
        }
        return false;
    }
}

