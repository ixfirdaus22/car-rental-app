package com.carrental.test;

import com.carrental.dao.UserDAO;
import com.carrental.dao.impl.UserDAOImpl;
import com.carrental.model.User;

public class TestUserDAO {

    public static void main(String[] args) {

        UserDAO userDAO = new UserDAOImpl();

        User user = new User();
        user.setName("Test User");
        user.setEmail("testuser1@gmail.com");
        user.setPassword("dummyhash123");
        user.setPhone("9999999999");
        user.setRole("CUSTOMER");

        boolean result = userDAO.addUser(user);

        if (result) {
            System.out.println("✅ User inserted successfully via DAO");
        } else {
            System.out.println("❌ DAO insert failed");
        }
    }
}
