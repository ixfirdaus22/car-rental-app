package com.carrental.servlets;

import java.io.IOException;

import com.carrental.dao.CarDAO;
import com.carrental.dao.impl.CarDAOImpl;
import com.carrental.model.Car;
import com.carrental.model.User;
import com.carrental.util.ValidationUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/addCar")
public class AddCarServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private CarDAO carDAO = new CarDAOImpl();

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("loggedUser") == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        User user = (User) session.getAttribute("loggedUser");
        int hostId = user.getUserId();

        String brand = request.getParameter("brand");
        String model = request.getParameter("model");
        String carType = request.getParameter("carType");
        String fuelType = request.getParameter("fuelType");
        String transmission = request.getParameter("transmission");
        String priceStr = request.getParameter("price");
        String location = request.getParameter("location");

        // 🔐 Validation
        if (ValidationUtil.isEmpty(brand) ||
            ValidationUtil.isEmpty(model) ||
            ValidationUtil.isEmpty(location) ||
            !ValidationUtil.isPositiveNumber(priceStr)) {

            response.sendRedirect("host/add-car.jsp?error=invalid");
            return;
        }

        double price = Double.parseDouble(priceStr);

        Car car = new Car();
        car.setHostId(hostId);
        car.setBrand(brand);
        car.setModel(model);
        car.setCarType(carType);
        car.setFuelType(fuelType);
        car.setTransmission(transmission);
        car.setPricePerDay(price);
        car.setLocation(location);

        boolean success = carDAO.addCar(car);

        if (success) {
            response.sendRedirect("host/dashboard.jsp");
        } else {
            response.sendRedirect("host/addcar.jsp?error=db");
        }
    }
}
