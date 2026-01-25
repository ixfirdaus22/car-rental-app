package com.carrental.test;

import com.carrental.dao.CarDAO;
import com.carrental.dao.impl.CarDAOImpl;
import com.carrental.model.Car;

public class TestCarsDAO {
	public static void main(String[] args) {

        CarDAO carDAO = new CarDAOImpl();

        Car car = new Car();
        car.setHostId(14);
        car.setBrand("Hyundai");
        car.setModel("i20");
        car.setCarType("SUV");
        car.setFuelType("PETROL");
        car.setTransmission("MANUAL");
        car.setPricePerDay(2500);
        car.setLocation("Pune");

        boolean result = carDAO.addCar(car);

        if (result) {
            System.out.println("✅ User inserted successfully via DAO");
        } else {
            System.out.println("❌ DAO insert failed");
        }
    }
}
