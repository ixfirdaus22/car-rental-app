package com.carrental.dao.impl;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.carrental.dao.BookingDAO;
import com.carrental.model.Booking;
import com.carrental.util.DBUtil;

public class BookingDAOImpl implements BookingDAO{

	@Override
	public boolean createdBooking(Booking booking) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Booking getBookingById(int bookingId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Booking> getBookingByUser(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Booking> getBookingByCar(int carId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean updateBookingStatus(int bookingId, String status) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public List<Integer> getBookedCarIds(LocalDate startDate, LocalDate endDate) {

		List<Integer> bookedCarIds = new ArrayList<>();
		
		String sql = """
				SELECT DISTINCT car_id FROM bookings
				WHERE NOT (end_date < ? OR start_date > ?)
				""";
		
		try(Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql)) {
			
			ps.setDate(1,  Date.valueOf(startDate));
			ps.setDate(2,  Date.valueOf(endDate));
			
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				bookedCarIds.add(rs.getInt("car_id"));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return bookedCarIds;
	}
	
	

}
