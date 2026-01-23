package com.carrental;

import java.sql.Connection;

import com.carrental.util.DBUtil;

public class TestDB {
	public static void main(String[] args) {
		Connection con = DBUtil.getConnection();
		if(con != null) {
			System.out.println("Database Connected!");
		}else {
			System.out.println("Database Connection Failed.");
		}
	}
}
