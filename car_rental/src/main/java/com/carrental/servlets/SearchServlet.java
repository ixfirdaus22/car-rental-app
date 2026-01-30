package com.carrental.servlets;

import com.carrental.dao.CarDAO;
import com.carrental.dao.BookingDAO;
import com.carrental.dao.impl.CarDAOImpl;
import com.carrental.dao.impl.BookingDAOImpl;
import com.carrental.model.Car;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@WebServlet("/search")
public class SearchServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private CarDAO carDAO = new CarDAOImpl();
    private BookingDAO bookingDAO = new BookingDAOImpl();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String startDateStr = request.getParameter("startDate");
        String endDateStr   = request.getParameter("endDate");

        LocalDate startDate = null;
        LocalDate endDate   = null;

        if (startDateStr != null && endDateStr != null &&
            !startDateStr.isEmpty() && !endDateStr.isEmpty() &&
            !"null".equalsIgnoreCase(startDateStr) &&
            !"null".equalsIgnoreCase(endDateStr)) {

            startDate = LocalDate.parse(startDateStr);
            endDate   = LocalDate.parse(endDateStr);
        }

        String location = request.getParameter("location");
        String model    = request.getParameter("model");
        String sortBy   = request.getParameter("sortBy");

        List<Car> allCars = carDAO.listCars();
        List<Car> availableCars = new ArrayList<>();

        Set<Integer> bookedCarIds = new HashSet<>();
        if (startDate != null && endDate != null) {
            bookedCarIds.addAll(
                bookingDAO.getBookedCarIds(startDate, endDate)
            );
        }

        for (Car car : allCars) {

            if (!bookedCarIds.isEmpty() &&
                bookedCarIds.contains(car.getCarId())) {
                continue;
            }

            if (location != null && !location.isEmpty()
                    && !car.getLocation().equalsIgnoreCase(location))
                continue;

            if (model != null && !model.isEmpty()
                    && !car.getModel().equalsIgnoreCase(model))
                continue;

            availableCars.add(car);
        }

        if ("priceAsc".equals(sortBy)) {
            availableCars.sort(
                Comparator.comparingDouble(Car::getPricePerDay)
            );
        } else if ("priceDesc".equals(sortBy)) {
            availableCars.sort(
                Comparator.comparingDouble(Car::getPricePerDay).reversed()
            );
        } else if ("rating".equals(sortBy)) {
            availableCars.sort(
                Comparator.comparingDouble(Car::getRating).reversed()
            );
        }

        
        request.setAttribute("startDate", startDateStr);
        request.setAttribute("endDate", endDateStr);
        request.setAttribute("carList", availableCars);
        request.getRequestDispatcher("cars.jsp")
               .forward(request, response);
    }

}
