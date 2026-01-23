package com.carrental.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;

import com.carrental.util.DBUtil;

public class UserDAO {
	public boolean insertUser(String name, String email, String password, String phone, String role) {
		String sql = "INSERT INTO users (name, email, password, phone, role)" + "VALUES(?, ?, ?, ?, ?)";
		try (Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql)){
			ps.setString(1, name);
			ps.setString(2, email);
			ps.setString(3, password);
			ps.setString(4, phone);
			ps.setString(5, role);
			
			return ps.executeUpdate() > 0;
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}
