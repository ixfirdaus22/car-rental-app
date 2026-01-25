<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <title>Add Car</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet">
</head>

<body class="bg-light">

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">

            <div class="card shadow">
                <div class="card-body">
                    <h3 class="text-center mb-3">Add New Car</h3>

                    <!-- ✅ ERROR HANDLING -->
                    <%
                        String error = request.getParameter("error");
                        if ("invalid".equals(error)) {
                    %>
                        <div class="alert alert-danger text-center">
                            Please enter valid car details.
                        </div>
                    <%
                        } else if ("db".equals(error)) {
                    %>
                        <div class="alert alert-danger text-center">
                            Failed to add car. Please try again.
                        </div>
                    <%
                        }
                    %>

                    <form action="../addCar" method="post">

                        <!-- Brand -->
                        <div class="mb-3">
                            <label class="form-label">Brand</label>
                            <input type="text" class="form-control"
                                   name="brand"
                                   placeholder="eg. Hyundai"
                                   required minlength="2">
                        </div>

                        <!-- Model -->
                        <div class="mb-3">
                            <label class="form-label">Model</label>
                            <input type="text" class="form-control"
                                   name="model"
                                   placeholder="eg. i20"
                                   required minlength="1">
                        </div>

                        <!-- Car Type -->
                        <div class="mb-3">
                            <label class="form-label">Car Type</label>
                            <select class="form-select" name="carType" required>
                                <option value="">Select Car Type</option>
                                <option value="SUV">SUV</option>
                                <option value="SEDAN">Sedan</option>
                                <option value="HATCHBACK">Hatchback</option>
                            </select>
                        </div>

                        <!-- Fuel Type -->
                        <div class="mb-3">
                            <label class="form-label">Fuel Type</label>
                            <select class="form-select" name="fuelType" required>
                                <option value="">Select Fuel Type</option>
                                <option value="PETROL">Petrol</option>
                                <option value="DIESEL">Diesel</option>
                                <option value="ELECTRIC">Electric</option>
                                <option value="CNG">CNG</option>
                            </select>
                        </div>

                        <!-- Transmission -->
                        <div class="mb-3">
                            <label class="form-label">Transmission</label>
                            <select class="form-select" name="transmission" required>
                                <option value="">Select Transmission</option>
                                <option value="MANUAL">Manual</option>
                                <option value="AUTOMATIC">Automatic</option>
                            </select>
                        </div>

                        <!-- Price -->
                        <div class="mb-3">
                            <label class="form-label">Price Per Day (₹)</label>
                            <input type="number" class="form-control"
                                   name="price"
                                   placeholder="2500"
                                   min="1" step="0.01"
                                   required>
                        </div>

                        <!-- Location -->
                        <div class="mb-3">
                            <label class="form-label">Location</label>
                            <input type="text" class="form-control"
                                   name="location"
                                   placeholder="Pune"
                                   minlength="2"
                                   required>
                        </div>

                        <button type="submit" class="btn btn-primary w-100">
                            Add Car
                        </button>

                    </form>
                </div>
            </div>

        </div>
    </div>
</div>

</body>
</html>
