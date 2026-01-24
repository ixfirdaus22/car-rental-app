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
import com.carrental.util.ValidationUtil;

@WebServlet("/register")
public class RegistrationServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private UserDAO userDAO = new UserDAOImpl();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println(">>> RegistrationServlet doPost HIT <<<");

        String name = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String phone = request.getParameter("phone");
        String role = request.getParameter("role");

        /* ================= VALIDATIONS ================= */

        if (ValidationUtil.isEmpty(name) ||
            ValidationUtil.isEmpty(email) ||
            ValidationUtil.isEmpty(password) ||
            ValidationUtil.isEmpty(role)) {

            request.setAttribute("error", "All mandatory fields are required.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        if (!ValidationUtil.isValidEmail(email)) {
            request.setAttribute("error", "Invalid email format.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        if (password.length() < 6) {
            request.setAttribute("error", "Password must be at least 6 characters.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        if (!ValidationUtil.isValidPhone(phone)) {
            request.setAttribute("error", "Phone number must be 10 digits.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        /* ============== END VALIDATIONS ================= */

        // Hash password AFTER validation
        String hashedPassword = PasswordUtil.hashPassword(password);

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(hashedPassword);
        user.setPhone(phone);
        user.setRole(role);

        boolean success = userDAO.addUser(user);

        if (success) {
            request.setAttribute("msg", "Registration successful. Please login.");
            request.getRequestDispatcher("login.jsp")
                   .forward(request, response);
        } else {
            request.setAttribute("error", "Registration failed. Email may already exist.");
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
