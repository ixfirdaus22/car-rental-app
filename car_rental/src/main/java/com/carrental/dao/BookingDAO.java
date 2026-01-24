package com.carrental.dao;

import java.util.List;

import com.carrental.model.Booking;

public interface BookingDAO {
	
	boolean createdBooking(Booking booking);
	
	Booking getBookingById(int bookingId);
	
	List<Booking> getBookingByUser(int userId);
	
	List<Booking> getBookingByCar(int carId);
	
	boolean updateBookingStatus(int bookingId, String status);
}
