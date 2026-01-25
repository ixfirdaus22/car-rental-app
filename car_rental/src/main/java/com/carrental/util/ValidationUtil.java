package com.carrental.util;

import java.util.regex.Pattern;

public class ValidationUtil {
	
	private static final String EMAIL_REGEX =
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

    public static boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }

    public static boolean isValidEmail(String email) {
        return Pattern.matches(EMAIL_REGEX, email);
    }
    
    public static boolean isValidPhone(String phone) {
        return phone == null || phone.isEmpty() || phone.matches("\\d{10}");
    }
    
    public static boolean isPositiveNumber(String value) {
        try {
            return Double.parseDouble(value) > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean isValidYear(String value) {
        try {
            int year = Integer.parseInt(value);
            return year >= 1990 && year <= 2100;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
