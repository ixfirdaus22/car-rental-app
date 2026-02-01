package com.carrental.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PriceCalculationResponse {
    private Double pricePerDay;
    private Integer days;
    private Double basePrice;
    private Double discountAmount;
    private Double taxAmount;
    private Double totalAmount;
    private String currency = "USD";
}
