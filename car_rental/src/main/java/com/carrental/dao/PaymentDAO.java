package com.carrental.dao;

import com.carrental.model.Payment;

public interface PaymentDAO {
	
	boolean addPayment(Payment payment);
	
	Payment getPaymentByBookingId(int bookingId);
	
	boolean updatePaymentStatus(int paymentId, String status);
}
