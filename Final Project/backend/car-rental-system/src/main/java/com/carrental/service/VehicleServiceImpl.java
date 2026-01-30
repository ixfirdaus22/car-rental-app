package com.carrental.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.carrental.dto.VehicleRequest;
import com.carrental.dto.VehicleResponse;
import com.carrental.dto.VehicleStatusUpdateRequest;
import com.carrental.entity.User;
import com.carrental.entity.Vehicle;
import com.carrental.enums.UserRole;
import com.carrental.enums.VehicleStatus;
import com.carrental.repository.UserRepository;
import com.carrental.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

	private final VehicleRepository vehicleRepository;
	private final UserRepository userRepository;

	@Override
	public VehicleResponse addVehicle(String vendorEmail, VehicleRequest request) {
		// Find vendor by email
		User vendor = userRepository.findByEmail(vendorEmail)
				.orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

		// Verify vendor role
		if (vendor.getRole() != UserRole.VENDOR) {
			throw new IllegalArgumentException("Only vendors can add vehicles");
		}

		// Check for duplicate license plate
		if (vehicleRepository.findByLicensePlate(request.getLicensePlate()).isPresent()) {
			throw new IllegalArgumentException("License plate already exists");
		}

		// Check for duplicate VIN
		if (vehicleRepository.findByVin(request.getVin()).isPresent()) {
			throw new IllegalArgumentException("VIN already exists");
		}

		// Create vehicle entity
		Vehicle vehicle = new Vehicle();
		vehicle.setMake(request.getMake());
		vehicle.setManufacturer(request.getMake()); // Map make to manufacturer for database
		vehicle.setModel(request.getModel());
		vehicle.setYear(request.getYear());
		vehicle.setColor(request.getColor());
		vehicle.setLicensePlate(request.getLicensePlate());
		vehicle.setVin(request.getVin());
		vehicle.setPricePerDay(request.getPricePerDay());
		vehicle.setFuelType(request.getFuelType());
		vehicle.setTransmission(request.getTransmission());
		vehicle.setSeatingCapacity(request.getSeatingCapacity());
		vehicle.setDescription(request.getDescription());
		vehicle.setImageUrl(request.getImageUrl());
		vehicle.setVendor(vendor);
		vehicle.setStatus(VehicleStatus.AVAILABLE);

		// Save vehicle
		Vehicle savedVehicle = vehicleRepository.save(vehicle);

		// Convert to response DTO
		return convertToResponse(savedVehicle);
	}

	@Override
	public VehicleResponse updateVehicle(String vendorEmail, Integer vehicleId, VehicleRequest request) {
		// Find vendor by email
		User vendor = userRepository.findByEmail(vendorEmail)
				.orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

		// Verify vendor role
		if (vendor.getRole() != UserRole.VENDOR) {
			throw new IllegalArgumentException("Only vendors can update vehicles");
		}

		// Find vehicle by ID
		Vehicle vehicle = vehicleRepository.findById(vehicleId)
				.orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

		// Verify ownership
		if (!vehicle.getVendor().getId().equals(vendor.getId())) {
			throw new IllegalArgumentException("You can only update your own vehicles");
		}

		// Check for duplicate license plate (if changed)
		if (!vehicle.getLicensePlate().equals(request.getLicensePlate())) {
			Optional<Vehicle> existingVehicleWithLicense = vehicleRepository
					.findByLicensePlate(request.getLicensePlate());
			if (existingVehicleWithLicense.isPresent()
					&& !existingVehicleWithLicense.get().getId().equals(vehicle.getId())) {
				throw new IllegalArgumentException("License plate already exists");
			}
		}

		// Check for duplicate VIN (if changed)
		if (!vehicle.getVin().equals(request.getVin())) {
			Optional<Vehicle> existingVehicleWithVin = vehicleRepository.findByVin(request.getVin());
			if (existingVehicleWithVin.isPresent() && !existingVehicleWithVin.get().getId().equals(vehicle.getId())) {
				throw new IllegalArgumentException("VIN already exists");
			}
		}

		// Update vehicle fields
		vehicle.setMake(request.getMake());
		vehicle.setManufacturer(request.getMake()); // Map make to manufacturer for database
		vehicle.setModel(request.getModel());
		vehicle.setYear(request.getYear());
		vehicle.setColor(request.getColor());
		vehicle.setLicensePlate(request.getLicensePlate());
		vehicle.setVin(request.getVin());
		vehicle.setPricePerDay(request.getPricePerDay());
		vehicle.setFuelType(request.getFuelType());
		vehicle.setTransmission(request.getTransmission());
		vehicle.setSeatingCapacity(request.getSeatingCapacity());
		vehicle.setDescription(request.getDescription());
		vehicle.setImageUrl(request.getImageUrl());

		// Save updated vehicle
		Vehicle updatedVehicle = vehicleRepository.save(vehicle);

		// Convert to response DTO
		return convertToResponse(updatedVehicle);
	}

	@Override
	public boolean deleteVehicle(String userEmail, Integer vehicleId) {
		// Find user by email
		User user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new IllegalArgumentException("User not found"));

		// Verify user role (Vendor or Admin)
		if (user.getRole() != UserRole.VENDOR && user.getRole() != UserRole.ADMIN) {
			throw new IllegalArgumentException("Only vendors or admins can delete vehicles");
		}

		// Find vehicle by ID
		Vehicle vehicle = vehicleRepository.findById(vehicleId)
				.orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

		// Verify ownership (Skip check for Admin)
		if (user.getRole() == UserRole.VENDOR && !vehicle.getVendor().getId().equals(user.getId())) {
			throw new IllegalArgumentException("You can only delete your own vehicles");
		}

		// Delete vehicle
		vehicleRepository.delete(vehicle);
		return true;
	}

	@Override
	public List<VehicleResponse> getAllAvailableVehicles() {
		// Get all vehicles with AVAILABLE status
		List<Vehicle> vehicles = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);

		// Convert to response DTOs
		return vehicles.stream().map(this::convertToResponse).collect(Collectors.toList());
	}

	@Override
	public VehicleResponse getVehicleById(Integer vehicleId) {
		// Find vehicle by ID
		Vehicle vehicle = vehicleRepository.findById(vehicleId)
				.orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

		// Convert to response DTO
		return convertToResponse(vehicle);
	}

	@Override
	public List<VehicleResponse> getVendorVehicles(String vendorEmail) {
		// Find vendor by email
		User vendor = userRepository.findByEmail(vendorEmail)
				.orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

		// Verify vendor role
		if (vendor.getRole() != UserRole.VENDOR) {
			throw new IllegalArgumentException("Only vendors can view their vehicles");
		}

		// Get all vehicles for this vendor
		List<Vehicle> vehicles = vehicleRepository.findByVendorId(vendor.getId());

		// Convert to response DTOs
		return vehicles.stream().map(this::convertToResponse).collect(Collectors.toList());
	}

	@Override
	public VehicleResponse updateVehicleStatus(String vendorEmail, Integer vehicleId,
			VehicleStatusUpdateRequest request) {
		// Find vendor by email
		User vendor = userRepository.findByEmail(vendorEmail)
				.orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

		// Verify vendor role
		if (vendor.getRole() != UserRole.VENDOR) {
			throw new IllegalArgumentException("Only vendors can update vehicle status");
		}

		// Find vehicle by ID
		Vehicle vehicle = vehicleRepository.findById(vehicleId)
				.orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

		// Verify ownership
		if (!vehicle.getVendor().getId().equals(vendor.getId())) {
			throw new IllegalArgumentException("You can only update status of your own vehicles");
		}

		// Parse and validate status
		VehicleStatus newStatus;
		try {
			newStatus = VehicleStatus.valueOf(request.getStatus().toUpperCase());
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Invalid vehicle status: " + request.getStatus());
		}

		// Update status
		vehicle.setStatus(newStatus);

		// Save updated vehicle
		Vehicle updatedVehicle = vehicleRepository.save(vehicle);

		// Convert to response DTO
		return convertToResponse(updatedVehicle);
	}

	// Helper method to convert Vehicle entity to VehicleResponse DTO
	private VehicleResponse convertToResponse(Vehicle vehicle) {
		VehicleResponse response = new VehicleResponse();
		response.setId(vehicle.getId());
		response.setMake(vehicle.getMake());
		response.setModel(vehicle.getModel());
		response.setYear(vehicle.getYear());
		response.setColor(vehicle.getColor());
		response.setLicensePlate(vehicle.getLicensePlate());
		response.setVin(vehicle.getVin());
		response.setPricePerDay(vehicle.getPricePerDay());
		response.setStatus(vehicle.getStatus());
		response.setFuelType(vehicle.getFuelType());
		response.setTransmission(vehicle.getTransmission());
		response.setSeatingCapacity(vehicle.getSeatingCapacity());
		response.setDescription(vehicle.getDescription());
		response.setImageUrl(vehicle.getImageUrl());
		response.setVendorId(vehicle.getVendor().getId());
		response.setVendorName(vehicle.getVendor().getName());
		response.setCreatedAt(vehicle.getCreatedAt());
		response.setUpdatedAt(vehicle.getUpdatedAt());
		return response;
	}

}
