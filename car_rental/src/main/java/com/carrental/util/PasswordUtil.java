package com.carrental.util;

import java.security.MessageDigest;

public class PasswordUtil {
	public static String hashPassword(String password) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			byte[] hashBytes = md.digest(password.getBytes("UTF-8"));
			
			StringBuilder hash = new StringBuilder();
			for(byte b : hashBytes) {
				hash.append(String.format("%02x", b));
			}
			return hash.toString();
		}catch (Exception e) {
			throw new RuntimeException("Error Hashing Password", e);
		}
	}
}
