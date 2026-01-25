package com.carrental.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.carrental.dao.CarDAO;
import com.carrental.model.Car;
import com.carrental.util.DBUtil;

public class CarDAOImpl implements CarDAO{
	
	private Car mapRowToCar(ResultSet rs) throws SQLException {
	    Car car = new Car();
	    car.setCarId(rs.getInt("car_id"));
	    car.setHostId(rs.getInt("host_id"));
	    car.setBrand(rs.getString("brand"));
	    car.setModel(rs.getString("model"));
	    car.setCarType(rs.getString("car_type"));
	    car.setFuelType(rs.getString("fuel_type"));
	    car.setTransmission(rs.getString("transmission"));
	    car.setPricePerDay(rs.getDouble("price_per_day"));
	    car.setLocation(rs.getString("location"));
	    car.setAvailabilityStatus(rs.getBoolean("availability_status"));
	    car.setApproved(rs.getBoolean("is_approved"));
	    return car;
	}

	@Override
	public boolean addCar(Car car) {
		String sql = "INSERT INTO cars (host_id, brand, model, car_type, fuel_type, transmission, price_per_day, location) " + "VALUES (?,?,?,?,?,?,?,?)";
		
		try(Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql)) {
				
			ps.setInt(1, car.getHostId());
			ps.setString(2, car.getBrand());
			ps.setString(3, car.getModel());
			ps.setString(4, car.getCarType());
			ps.setString(5, car.getFuelType());
			ps.setString(6,  car.getTransmission());
			ps.setDouble(7, car.getPricePerDay());
			ps.setString(8, car.getLocation());
			
			return ps.executeUpdate() > 0;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public Car getCarById(int carId) {
		String sql = "SELECT * FROM cars WHERE car_id=?";
		
		try(Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql)){
			
			ps.setInt(1, carId);
			ResultSet rs = ps.executeQuery();
			
			if(rs.next()) {
				return mapRowToCar(rs);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		 return null;
	}

	@Override
	public List<Car> listCars() {
		List<Car> cars = new ArrayList<>();
		String sql = "SELECT * FROM cars WHERE is_approved = TRUE AND availability_status = TRUE";
		
		try (Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql);
				ResultSet rs = ps.executeQuery()) {
			
			while (rs.next()) {
				cars.add(mapRowToCar(rs));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return cars;
	}

	@Override
	public List<Car> getCarsByHost(int hostId) {
		List<Car> cars = new ArrayList<>();
		String sql = "SELECT * FROM cars WHERE host_id=?";
		
		try(Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql)) {
			ps.setInt(1, hostId);
			ResultSet rs = ps.executeQuery();
			
			while (rs.next()) {
				cars.add(mapRowToCar(rs));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return cars;
	}

	@Override
	public List<Car> getAllApprovedCars() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean updateCar(Car car) {
		String sql = "UPDATE cars SET brand=?, model=?, car_type=?, fuel_type=?, transmission=?, price_per_day=?, location=? " + "WHERE car_id=?";
		
		try (Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql)) {
			
			ps.setString(1, car.getBrand());
			ps.setString(2, car.getModel());
			ps.setString(3, car.getCarType());
			ps.setString(4, car.getFuelType());
			ps.setString(5,  car.getTransmission());
			ps.setDouble(6, car.getPricePerDay());
			ps.setString(7, car.getLocation());
			ps.setInt(8, car.getCarId());
			
			return ps.executeUpdate() > 0;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public boolean deleteCar(int carId) {
		String sql = "DELETE FROM cars WHERE car_id=?";
		
		try (Connection con = DBUtil.getConnection();
				PreparedStatement ps = con.prepareStatement(sql)) {
			
			ps.setInt(1, carId);
			return ps.executeUpdate() > 0;
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
}
