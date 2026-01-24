package com.carrental.dao;

import java.util.List;

import com.carrental.model.Car;

public interface CarDAO {
	
	boolean addCar(Car car);
	
	Car getCarById(int carId);
	
	List<Car> getCarsByHost(int hostId);
	
	List<Car> getAllApprovedCars();
	
	boolean updateCar(Car car);
	
	boolean deleteCar(int carId);
}
