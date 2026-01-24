package com.carrental.dao;

import java.util.List;

import com.carrental.model.Reviews;

public interface ReviewDAO {
	
	boolean addReview(Reviews review);
	
	List<Reviews> getReviewsByCar(int carId);
	
	List<Reviews> getReviewsByUser(int userId);
	
	double getAverageRatingForCar(int carId);
	
	boolean deleteReview(int reviewId);
}
