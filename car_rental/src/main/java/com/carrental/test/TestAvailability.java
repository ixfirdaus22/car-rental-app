package com.carrental.test;

import java.time.LocalDate;
import java.util.List;

import com.carrental.dao.BookingDAO;
import com.carrental.dao.impl.*;



public class TestAvailability {
    public static void main(String[] args) {
        BookingDAO bookingDAO = new BookingDAOImpl();

        List<Integer> bookedCars =
            bookingDAO.getBookedCarIds(
                LocalDate.of(2026, 2, 11),
                LocalDate.of(2026, 2, 13)
            );

        System.out.println(bookedCars);
    }
}