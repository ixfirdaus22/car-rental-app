package com.carrental;

import java.sql.Connection;

import com.carrental.util.DBConnection;

public class TestDB {
	public static void main(String[] args) {
		Connection con = DBConnection.getConnection();
		if(con != null) {
			System.out.println("Database Connected!");
		}else {
			System.out.println("Database Connection Failed.");
		}
	}
}
