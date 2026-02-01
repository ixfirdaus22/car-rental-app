package com.carrental.service;

public interface ReportService {
    byte[] generateBookingsReportCsv();

    byte[] generateBookingsReportPdf();
}
