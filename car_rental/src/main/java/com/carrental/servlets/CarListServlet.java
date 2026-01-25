package com.carrental.servlets;

import com.carrental.dao.CarDAO;
import com.carrental.dao.impl.CarDAOImpl;
import com.carrental.model.Car;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/cars")
public class CarListServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	
	private CarDAO carDAO = new CarDAOImpl();
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String modelFilter = request.getParameter("model");
		String locationFilter = request.getParameter("location");
		
		List<Car> allCars = carDAO.listCars();
		List<Car> filteredCars = new ArrayList<>();
		
		for(Car car : allCars) {
			boolean matches = true;
			
			if(modelFilter != null && !modelFilter.isEmpty()) {
				matches &= car.getModel().equalsIgnoreCase(modelFilter);
			}
			if(locationFilter != null && !locationFilter.isEmpty()) {
				matches &= car.getLocation().equalsIgnoreCase(locationFilter);
			}
			if(matches) {
				filteredCars.add(car);
			}
		}
		
		System.out.println(">>> CarListServlet HIT <<<");
		
		request.setAttribute("carList", filteredCars);
		request.getRequestDispatcher("cars.jsp").forward(request, response);
	}
}
