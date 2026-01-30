package com.carrental.dao;

import java.sql.Connection;
import java.time.LocalDate;
import java.util.List;

import com.carrental.model.Booking;

public interface BookingDAO {
	
	boolean isCarAvailable(int carId, LocalDate startDate, LocalDate endDate, Connection con);
	
	boolean createBooking(Booking booking, Connection con);
	
	Booking getBookingById(int bookingId);
	
	List<Booking> getBookingByUser(int userId);
	
	List<Booking> getBookingByCar(int carId);
	
	boolean updateBookingStatus(int bookingId, String status);
	
	List<Integer> getBookedCarIds(LocalDate startDate, LocalDate endDate);
}
