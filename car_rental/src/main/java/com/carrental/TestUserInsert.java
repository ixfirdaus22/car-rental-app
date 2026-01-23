package com.carrental;

import com.carrental.dao.UserDAO;

public class TestUserInsert {
	public static void main(String[] args) {
		UserDAO userDAO = new UserDAO();
		boolean result = userDAO.insertUser(
				"Test User",
				"testuser@gmail.com",
				"test123",
				"1234567890",
				"CUSTOMER"
				);
		if (result) {
			System.out.println("Dummy user inserted successfully");
		}else {
			System.out.println("User insertion failed");
		}
	}
}
