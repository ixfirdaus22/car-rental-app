package com.carrental.service;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.carrental.entity.Booking;
import com.carrental.repository.BookingRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final BookingRepository bookingRepository;
    private final ObjectMapper objectMapper;

    @Override
    public byte[] generateBookingsReportCsv() {
        List<Booking> bookings = bookingRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,User Email,Vehicle,Pickup Date,Return Date,Status,Total Amount\n");
        for (Booking b : bookings) {
            csv.append(b.getId()).append(",");
            csv.append(escapeSpecialCharacters(b.getUser().getEmail())).append(",");
            String vehicle = b.getVehicle().getMake() + " " + b.getVehicle().getModel();
            csv.append(escapeSpecialCharacters(vehicle)).append(",");
            csv.append(b.getPickupDate()).append(",");
            csv.append(b.getReturnDate()).append(",");
            csv.append(b.getStatus()).append(",");
            csv.append(b.getTotalAmount()).append("\n");
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeSpecialCharacters(String data) {
        if (data == null)
            return "";
        String escapedData = data.replaceAll("\\R", " ");
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = "\"" + data + "\"";
        }
        return escapedData;
    }

    @Override
    public byte[] generateBookingsReportPdf() {
        List<Booking> bookings = bookingRepository.findAll();

        List<Map<String, Object>> data = new ArrayList<>();
        for (Booking b : bookings) {
            Map<String, Object> row = new HashMap<>();
            row.put("Id", b.getId());
            row.put("UserEmail", b.getUser().getEmail());
            row.put("VehicleModel", b.getVehicle().getMake() + " " + b.getVehicle().getModel());
            row.put("PickupDate", b.getPickupDate().toString());
            row.put("ReturnDate", b.getReturnDate().toString());
            row.put("TotalAmount", b.getTotalAmount());
            row.put("Status", b.getStatus().toString());
            data.add(row);
        }

        try {
            File jsonFile = File.createTempFile("bookings", ".json");
            objectMapper.writeValue(jsonFile, data);

            File pdfFile = File.createTempFile("report", ".pdf");

            // The path to the dotnet project relative to the running directory
            // Current dir: backend/car-rental-system
            // Target dir: backend/pdf-generator
            String projectPath = "../pdf-generator";

            ProcessBuilder pb = new ProcessBuilder("dotnet", "run", "--project", projectPath, "--",
                    jsonFile.getAbsolutePath(), pdfFile.getAbsolutePath());

            pb.inheritIO();
            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("PDF Generator failed with exit code " + exitCode);
            }

            byte[] bytes = Files.readAllBytes(pdfFile.toPath());

            // Cleanup
            jsonFile.delete();
            pdfFile.delete();

            return bytes;

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
