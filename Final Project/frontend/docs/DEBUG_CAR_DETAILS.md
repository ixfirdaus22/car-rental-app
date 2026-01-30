# Debug Guide: Car Details Page Not Working

## Common Issues and Solutions

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors:
- Look for network errors
- Check for authentication errors (401)
- Verify API calls are being made

### 2. Verify Route
The route should be: `/car/:carId`
- Check if URL changes when clicking "View Details"
- Verify the carId parameter is being passed

### 3. Check API Call
The API endpoint is: `GET /api/vehicles/{id}`
- This requires authentication
- Check if user is logged in
- Verify token is being sent in headers

### 4. Test Direct API Call
Try accessing the API directly:
```bash
curl -X GET "http://localhost:8080/api/vehicles/4" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Check Network Tab
In browser DevTools → Network tab:
- Look for the `/api/vehicles/{id}` request
- Check the response status code
- Verify the response data

### 6. Authentication Issue
If you see 401 Unauthorized:
- User needs to be logged in
- Token might be expired
- Try logging out and logging back in

### 7. Fallback Data
The page should work even if API fails:
- It uses data from `location.state` (passed from CarCard)
- Falls back to CAR_DATABASE if available
- Shows error only if all fail

## Quick Fixes

1. **Clear browser cache and reload**
2. **Check if backend is running** on port 8080
3. **Verify user is logged in**
4. **Check browser console for specific errors**
