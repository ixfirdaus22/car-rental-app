package com.carrental.servlets;

import com.carrental.dao.BookingDAO;
import com.carrental.dao.impl.BookingDAOImpl;
import com.carrental.model.Booking;
import com.carrental.model.User;
import com.carrental.util.DBUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.Connection;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@WebServlet("/bookCar")
public class BookingServlet extends HttpServlet{
	
    private static final long serialVersionUID = 1L;
	
	private BookingDAO bookingDAO = new BookingDAOImpl();
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		System.out.println("🔥 BookingServlet HIT");

		HttpSession session = request.getSession(false);
		
		if(session == null || session.getAttribute("loggedUser") == null) {
			response.sendRedirect("login.jsp");
			return;
		}
		
		User user = (User) session.getAttribute("loggedUser");
		
		String carIdStr     = request.getParameter("carId");
		String startDateStr = request.getParameter("startDate");
		String endDateStr   = request.getParameter("endDate");
		String priceStr     = request.getParameter("price");

		System.out.println("carId     = " + carIdStr);
		System.out.println("startDate = " + startDateStr);
		System.out.println("endDate   = " + endDateStr);
		System.out.println("price     = " + priceStr);

		// 🔐 VALIDATION (MANDATORY)
		if (carIdStr == null || priceStr == null ||
		    startDateStr == null || endDateStr == null ||
		    carIdStr.isEmpty() || priceStr.isEmpty() ||
		    startDateStr.isEmpty() || endDateStr.isEmpty() ||
		    "null".equalsIgnoreCase(startDateStr) ||
		    "null".equalsIgnoreCase(endDateStr)) {

		    response.sendRedirect("cars.jsp?error=selectDates");
		    return;
		}

		int carId = Integer.parseInt(carIdStr);
		double pricePerDay = Double.parseDouble(priceStr);

		LocalDate startDate = LocalDate.parse(startDateStr);
		LocalDate endDate   = LocalDate.parse(endDateStr);
		
		long days = ChronoUnit.DAYS.between(startDate, endDate);
		double totalAmount = days * pricePerDay;
		
		Connection con = null;
		
		try {
			con = DBUtil.getConnection();
			con.setAutoCommit(false);
			
			boolean available = bookingDAO.isCarAvailable(carId, startDate, endDate, con);
			
			if(!available) {
				con.rollback();
				response.sendRedirect("cars.jsp?error=notAvailable");
				return;
			}
			
			Booking booking = new Booking();
			booking.setUserId(user.getUserId());
			booking.setCarId(carId);
			booking.setStartDate(startDate);
			booking.setEndDate(endDate);
			booking.setTotalAmount(totalAmount);
			
			boolean booked = bookingDAO.createBooking(booking, con);
			
			if(booked) {
				con.commit();
				response.sendRedirect("bookingsuccess.jsp");
			} else {
				con.rollback();
				response.sendRedirect("cars.jsp?error=failed");
			}
		} catch (Exception e) {
			try {
				if (con != null) con.rollback();
			} catch (Exception ex) {
				ex.printStackTrace();
			}
			e.printStackTrace();
			response.sendRedirect("cars.jsp?error=exception");
		} finally {
			try {
				if(con!= null) {
					con.setAutoCommit(true);
					con.close();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	
}
