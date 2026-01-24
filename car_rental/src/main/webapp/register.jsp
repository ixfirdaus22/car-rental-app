<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>User Registration</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet">
</head>

<body class="bg-light">

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-5">

            <div class="card shadow">
                <div class="card-body">
                    <h3 class="text-center mb-4">User Registration</h3>

                    <!-- Server-side error messages -->
                    <%
   						 String error = (String) request.getAttribute("error");
  						  if (error != null) {
					%>
					    <div class="alert alert-danger">
				        <%= error %>
					    </div>
					<%
					    }
					%>


                    <form action="register" method="post" novalidate>

                        <!-- Full Name -->
                        <div class="mb-3">
                            <label class="form-label">Full Name</label>
                            <input type="text"
                                   name="username"
                                   class="form-control"
                                   required
                                   minlength="3"
                                   pattern="[A-Za-z ]+"
                                   title="Only alphabets allowed (min 3 characters)">
                        </div>

                        <!-- Email -->
                        <div class="mb-3">
                            <label class="form-label">Email Address</label>
                            <input type="email"
                                   name="email"
                                   class="form-control"
                                   required>
                        </div>

                        <!-- Password -->
                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input type="password"
                                   name="password"
                                   class="form-control"
                                   required
                                   minlength="6"
                                   title="Password must be at least 6 characters">
                        </div>

                        <!-- Phone -->
                        <div class="mb-3">
                            <label class="form-label">Phone</label>
                            <input type="text"
                                   name="phone"
                                   class="form-control"
                                   pattern="[0-9]{10}"
                                   title="Enter 10-digit mobile number">
                        </div>

                        <!-- Role -->
                        <div class="mb-3">
                            <label class="form-label">Role</label>
                            <select name="role" class="form-select" required>
                                <option value="">Select Role</option>
                                <option value="CUSTOMER">Customer</option>
                                <option value="HOST">Host</option>
                            </select>
                        </div>

                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary">
                                Register
                            </button>
                        </div>
                    </form>

                    <div class="text-center mt-3">
                        Already registered?
                        <a href="login.jsp">Login</a>
                    </div>

                </div>
            </div>

        </div>
    </div>
</div>

</body>
</html>
