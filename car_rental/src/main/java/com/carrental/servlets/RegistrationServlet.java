package com.carrental.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import com.carrental.dao.UserDAO;
import com.carrental.dao.impl.UserDAOImpl;
import com.carrental.model.User;
import com.carrental.util.PasswordUtil;


@WebServlet("/register")
public class RegistrationServlet extends HttpServlet{
	
	private static final long serialVersionUID = 1L;
	
	private UserDAO userDAO = new UserDAOImpl();
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println(">>> RegistrationServlet doPost HIT <<<");
		// 1. Read form data
		String name = request.getParameter("username");
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		String phone = request.getParameter("phone");
		String role = request.getParameter("role");
		// 2. Hash password
		String hashedPassword = PasswordUtil.hashPassword(password);
		// 3. Create User object
		User user = new User();
		user.setName(name);
		user.setEmail(email);
		user.setPassword(hashedPassword);
		user.setPhone(phone);
		user.setRole(role);
		// 4. Save user
		boolean success = userDAO.addUser(user);
		// 5. Redirect
		if (success) {
		    request.setAttribute("msg", "Registration successful. Please login.");
		    request.getRequestDispatcher("login.jsp")
		           .forward(request, response);
		} else {
		    request.setAttribute("error", "Registration failed. Try again.");
		    request.getRequestDispatcher("register.jsp")
		           .forward(request, response);
		}
		
	}
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
	        throws IOException {
	    response.getWriter().println("Register servlet is alive. Use POST.");
	}
}
