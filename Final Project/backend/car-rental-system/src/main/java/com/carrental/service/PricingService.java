package com.carrental.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import com.carrental.dto.PriceCalculationResponse;
import com.carrental.entity.Vehicle;

@Service
public class PricingService {

    private static final double TAX_RATE = 0.10; // 10% tax
    private static final double DISCOUNT_7_DAYS = 0.10; // 10% discount for > 7 days
    private static final double DISCOUNT_30_DAYS = 0.20; // 20% discount for > 30 days

    public PriceCalculationResponse calculatePrice(Vehicle vehicle, LocalDate pickupDate, LocalDate returnDate) {
        if (pickupDate == null || returnDate == null || vehicle == null) {
            throw new IllegalArgumentException("Invalid input for price calculation");
        }

        long days = ChronoUnit.DAYS.between(pickupDate, returnDate);
        if (days <= 0) {
            days = 1; // Minimum 1 day charge
        }

        double basePrice = vehicle.getPricePerDay() * days;
        double discountAmount = 0.0;

        if (days > 30) {
            discountAmount = basePrice * DISCOUNT_30_DAYS;
        } else if (days > 7) {
            discountAmount = basePrice * DISCOUNT_7_DAYS;
        }

        double priceAfterDiscount = basePrice - discountAmount;
        double taxAmount = priceAfterDiscount * TAX_RATE;
        double totalAmount = priceAfterDiscount + taxAmount;

        return PriceCalculationResponse.builder()
                .pricePerDay(vehicle.getPricePerDay())
                .days((int) days)
                .basePrice(basePrice)
                .discountAmount(discountAmount)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .currency("USD")
                .build();
    }
}
