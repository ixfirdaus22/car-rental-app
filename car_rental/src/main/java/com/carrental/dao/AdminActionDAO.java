package com.carrental.dao;

import java.util.List;

import com.carrental.model.AdminActions;

public interface AdminActionDAO {
	
	boolean logAdminAction(AdminActions action);
	
	List<AdminActions> getActionsByAdmin(int adminId);
	
	List<AdminActions> getActionsByEntity(String targetEntity);
	
	List<AdminActions> getAllAdminActions();
}
