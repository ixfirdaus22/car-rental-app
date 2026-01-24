package com.carrental.servlets;

import java.io.IOException;

import com.carrental.dao.UserDAO;
import com.carrental.dao.impl.UserDAOImpl;
import com.carrental.model.User;
import com.carrental.util.PasswordUtil;
import com.carrental.util.ValidationUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private UserDAO userDAO = new UserDAOImpl();

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        /* ============== VALIDATIONS ================= */

        if (ValidationUtil.isEmpty(email) || ValidationUtil.isEmpty(password)) {
            response.sendRedirect("login.jsp?error=empty");
            return;
        }

        if (!ValidationUtil.isValidEmail(email)) {
            response.sendRedirect("login.jsp?error=email");
            return;
        }

        /* ============== END VALIDATIONS ============== */

        // Hash password AFTER validation
        String hashedPassword = PasswordUtil.hashPassword(password);

        User user = userDAO.getUserByEmailAndPassword(email, hashedPassword);

        if (user != null) {

            // Prevent session fixation
            HttpSession oldSession = request.getSession(false);
            if (oldSession != null) {
                oldSession.invalidate();
            }

            HttpSession session = request.getSession(true);
            session.setAttribute("loggedUser", user);
            session.setAttribute("role", user.getRole());

            System.out.println("✅ LOGIN SUCCESS: " + user.getEmail());

            response.sendRedirect("dashboard.jsp");

        } else {
            response.sendRedirect("login.jsp?error=true");
        }
    }
}
