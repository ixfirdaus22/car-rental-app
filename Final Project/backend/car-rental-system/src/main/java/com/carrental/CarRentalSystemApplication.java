package com.carrental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CarRentalSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarRentalSystemApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	public org.springframework.boot.CommandLineRunner resetAdminPassword(
			com.carrental.repository.UserRepository userRepo,
			org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return args -> {
			try {
				com.carrental.entity.User admin = userRepo.findByEmail("admin@example.com").orElse(null);
				if (admin != null) {
					// Hard reset the password to 'password'
					admin.setPassword(passwordEncoder.encode("password")); // Using the app's encoder
					userRepo.save(admin);
					System.out.println("ADMIN PASSWORD RESET TO 'password' SUCCESSFULLY");
				} else {
					System.out.println("ADMIN USER NOT FOUND");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		};
	}

}