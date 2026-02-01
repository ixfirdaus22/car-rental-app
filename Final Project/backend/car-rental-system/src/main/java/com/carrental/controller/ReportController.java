package com.carrental.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.carrental.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/bookings/csv")
    public ResponseEntity<byte[]> exportBookingsCsv() {
        byte[] data = reportService.generateBookingsReportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bookings_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    @GetMapping("/bookings/pdf")
    public ResponseEntity<byte[]> exportBookingsPdf() {
        byte[] data = reportService.generateBookingsReportPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bookings_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }
}
