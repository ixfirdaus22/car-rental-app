<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Login</title>

    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet">
</head>

<body class="bg-light">

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-4">

            <div class="card shadow mt-5">
                <div class="card-body">
                    <h3 class="text-center mb-4">User Login</h3>

                    <!-- Server-side error messages -->
                    <%
                        String error = request.getParameter("error");
                        if ("empty".equals(error)) {
                    %>
                        <div class="alert alert-danger">
                            Email and password are required.
                        </div>
                    <%
                        } else if ("email".equals(error)) {
                    %>
                        <div class="alert alert-danger">
                            Invalid email format.
                        </div>
                    <%
                        } else if ("true".equals(error)) {
                    %>
                        <div class="alert alert-danger">
                            Invalid email or password.
                        </div>
                    <%
                        }
                    %>

                    <form action="login" method="post" novalidate>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email"
                                   name="email"
                                   class="form-control"
                                   placeholder="Enter email"
                                   required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Password</label>
                            <input type="password"
                                   name="password"
                                   class="form-control"
                                   placeholder="Enter password"
                                   required
                                   minlength="6"
                                   title="Password must be at least 6 characters">
                        </div>

                        <button type="submit"
                                class="btn btn-primary w-100">
                            Login
                        </button>
                    </form>

                    <div class="text-center mt-3">
                        <a href="register.jsp">New user? Register</a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

</body>
</html>
