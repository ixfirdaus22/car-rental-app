<%@ page import="java.util.List" %>
<%@ page import="com.carrental.model.Car" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Available Cars</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet">
</head>

<body class="bg-light">

<div class="container mt-4">

    <h2 class="text-center mb-4">Available Cars</h2>

    <!-- Filter Form -->
    <form method="get" action="search" class="row g-3 mb-4">
    
    <input type="hidden" name="startDate"
           value="<%= request.getParameter("startDate") %>">

    <input type="hidden" name="endDate"
           value="<%= request.getParameter("endDate") %>">
           
        <div class="col-md-4">
            <input type="text" name="model" class="form-control"
                   placeholder="Filter by Model">
        </div>
        <div class="col-md-4">
            <input type="text" name="location" class="form-control"
                   placeholder="Filter by Location">
        </div>
        <div class="col-md-3">
        <select name="sortBy" class="form-select">
            <option value="">Sort By</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
            <option value="rating">Rating</option>
        </select>
    </div>

    <div class="col-md-3">
        <button type="submit" class="btn btn-primary w-100">
            Apply
        </button>
    </div>
    </form>

    <!-- Cars Grid -->
    <div class="row">

<%
    List<Car> carList = (List<Car>) request.getAttribute("carList");

    if (carList != null && !carList.isEmpty()) {
        for (Car car : carList) {
%>
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <h5 class="card-title">
                        <%= car.getBrand() %> <%= car.getModel() %>
                    </h5>
                    <p class="card-text">
                        <strong>Car Type:</strong> <%= car.getCarType() %><br>
                        <strong>Fuel Type:</strong> <%= car.getFuelType() %><br>
                        <strong>Transmission:</strong> <%= car.getTransmission() %><br>
                        <strong>Location:</strong> <%= car.getLocation() %><br>
                        <strong>Price/Day:</strong> ₹ <%= car.getPricePerDay() %>
                        <strong>Rating:</strong> <%= car.getRating() %> ⭐<br>
                    </p>
                    <a href="#" class="btn btn-success w-100 disabled">
                        Book Now
                    </a>
                </div>
            </div>
        </div>
<%
        }
    } else {
%>
        <div class="col-12">
            <div class="alert alert-warning text-center">
                No cars available
            </div>
        </div>
<%
    }
%>

    </div>
</div>

<!-- Bootstrap JS (optional) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
