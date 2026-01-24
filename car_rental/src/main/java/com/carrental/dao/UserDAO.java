package com.carrental.dao;

import java.util.List;

import com.carrental.model.User;

public interface UserDAO {
	
	boolean addUser(User user);
	
	User getUserById(int userId);
	
	User getUserByEmail(String email);
	
	List<User> getAllUsers();
	
	boolean updateUser(User user);
	
	boolean deleteUser(int userId);
}
