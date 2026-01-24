package com.carrental.dao;

import java.time.LocalDate;
import java.util.List;

public interface CarAvailabilityDAO {
	
	boolean addAvailability(int carId, LocalDate date, boolean isAvailable);
	
	boolean updateAvailabilty(int carId, LocalDate date, boolean isAvailable);
	
	boolean isCarAvailable(int carId, LocalDate date);
	
	List<LocalDate> getUnavailableDates(int carId);
}
