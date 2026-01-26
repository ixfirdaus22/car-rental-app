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

        // Basic validation
        if (startDateStr == null || endDateStr == null) {
            response.sendRedirect("searchcars.jsp?error=date");
            return;
        }

        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate   = LocalDate.parse(endDateStr);

        String location = request.getParameter("location");
        String model    = request.getParameter("model");
        String sortBy   = request.getParameter("sortBy");

        List<Car> allCars = carDAO.listCars();

        // Convert to Set for faster lookup
        Set<Integer> bookedCarIds =
                new HashSet<>(bookingDAO.getBookedCarIds(startDate, endDate));

        List<Car> availableCars = new ArrayList<>();

        for (Car car : allCars) {

            // Exclude booked cars
            if (bookedCarIds.contains(car.getCarId()))
                continue;

            // Location filter
            if (location != null && !location.isEmpty()
                    && !car.getLocation().equalsIgnoreCase(location))
                continue;

            // Model filter
            if (model != null && !model.isEmpty()
                    && !car.getModel().equalsIgnoreCase(model))
                continue;

            availableCars.add(car);
        }

        // Sorting
        if ("priceAsc".equals(sortBy)) {
            availableCars.sort(Comparator.comparingDouble(Car::getPricePerDay));
        } else if ("priceDesc".equals(sortBy)) {
            availableCars.sort(Comparator.comparingDouble(Car::getPricePerDay).reversed());
        } else if ("rating".equals(sortBy)) {
            availableCars.sort(Comparator.comparingDouble(Car::getRating).reversed());
        }
        
        System.out.println("SORT BY = " + sortBy);


        request.setAttribute("carList", availableCars);
        request.getRequestDispatcher("cars.jsp").forward(request, response);
    }
}
