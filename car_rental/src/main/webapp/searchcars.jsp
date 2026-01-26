<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Search Cars</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet">

    <script>
        function validateDates() {
            const startDate = document.getElementById("startDate").value;
            const endDate = document.getElementById("endDate").value;

            if (startDate === "" || endDate === "") {
                alert("Please select both start and end dates.");
                return false;
            }

            if (new Date(startDate) >= new Date(endDate)) {
                alert("End date must be after start date.");
                return false;
            }
            return true;
        }
    </script>
</head>

<body class="bg-light">

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8">

            <div class="card shadow p-4">
                <h3 class="text-center mb-4">Search Available Cars</h3>

                <form action="search" method="get" onsubmit="return validateDates();">

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Start Date</label>
                            <input type="date" id="startDate" name="startDate"
                                   class="form-control" required>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">End Date</label>
                            <input type="date" id="endDate" name="endDate"
                                   class="form-control" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Car Model / Type</label>
                        <input type="text" name="model"
                               class="form-control"
                               placeholder="e.g. i20, SUV">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Location</label>
                        <input type="text" name="location"
                               class="form-control"
                               placeholder="e.g. Pune, Mumbai">
                    </div>

                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">
                            Search Cars
                        </button>
                    </div>

                </form>
            </div>

        </div>
    </div>
</div>

</body>
</html>
