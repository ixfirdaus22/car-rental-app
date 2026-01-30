# Vendor Portal - Testing Guide

## Quick Start Testing

### 1. Register as a Vendor
1. Navigate to `http://localhost:5174/register`
2. Click on the "🚗 Vendor" button
3. Fill in the form:
   - **Full Name**: John's Car Rentals
   - **Email**: john@carrental.com
   - **Phone**: +91 98765 43200
   - **Business Name**: John's Car Rentals
   - **Business Address**: 123 Car Street, Mumbai, MH 400001
   - **Password**: password123
   - **Confirm Password**: password123
4. Click "Register"
5. You should be redirected to the Vendor Dashboard

### 2. Explore Vendor Dashboard
- **URL**: `/vendor/dashboard`
- **Features to test**:
  - View stat cards (5 cars, 8 active bookings, etc.)
  - Check revenue overview with interactive chart
  - Click on different bars to see monthly details
  - Scroll through recent bookings table
  - Click "View All" to go to full bookings page

### 3. Manage Your Cars
- **URL**: `/vendor/cars`
- **Features to test**:
  - View all 5 cars in grid layout
  - Check car specifications (fuel type, transmission, seating)
  - View daily rates and customer ratings
  - Filter cars by status (All, Available, Rented, Maintenance)
  - Click "View Details" on any car to see modal
  - Click "Edit" button (placeholder functionality)
  - Scroll down to see detailed table view

### 4. View Bookings
- **URL**: `/vendor/bookings`
- **Features to test**:
  - View 6 sample bookings in card layout
  - Filter bookings by status (Active, Pending, Confirmed, Completed, Cancelled)
  - View customer information with avatars
  - Check booking dates and amounts
  - Click "View Details" on any booking to see modal
  - In modal, confirm/reject buttons appear for pending bookings
  - View customer ratings for completed bookings

### 5. Track Revenue
- **URL**: `/vendor/revenue`
- **Features to test**:
  - View total revenue, monthly averages, total bookings
  - Interactive 6-month revenue chart
  - Click on bars to highlight selected month
  - See monthly details update
  - View transaction history table
  - Check payout information section
  - See bank details and request payout button

### 6. Customize Settings
- **URL**: `/vendor/settings`
- **Features to test**:
  - Edit personal information fields
  - Update business details
  - Modify bank account information
  - Toggle notification preferences (all switches work)
  - View account management options

## Test Data Included

### Sample Cars
1. **Maruti Swift** - 1,800/day - ⭐ 4.7/5 - 12 bookings - Available
2. **Honda Accord** - 2,500/day - ⭐ 4.8/5 - 18 bookings - Available
3. **Mahindra XUV500** - 3,200/day - ⭐ 4.9/5 - 25 bookings - Available
4. **Tata Nexon** - 2,200/day - ⭐ 4.6/5 - 15 bookings - Maintenance
5. **Toyota Fortuner** - 4,500/day - ⭐ 4.5/5 - 8 bookings - Available

### Sample Bookings
- 6 bookings with different statuses
- Customer details with contact information
- Pickup/return dates and locations
- Customer ratings for completed bookings

### Revenue Data
- 6 months of revenue data (July - December)
- Total estimated earnings: ₹2,24,200
- Transaction history with payment status

## Interactive Elements to Test

### Clickable Elements
- ✅ Sidebar navigation menu
- ✅ Filter buttons with active states
- ✅ Card hover effects
- ✅ Modal open/close functionality
- ✅ Toggle switches for notifications
- ✅ Buttons (primary, outline, secondary)
- ✅ Form inputs and textareas
- ✅ Status badges and indicators

### Responsive Behavior
- ✅ Desktop layout (full sidebar)
- ✅ Resize browser to test responsiveness
- ✅ Check mobile view (may need improvements)

## Logout & Return

### To Test Authentication
1. Click "🚪 Logout" in sidebar footer
2. You'll be redirected to login page
3. Register again or login with different credentials
4. Try accessing vendor routes directly
5. Should redirect to login if not authenticated

## Browser Console

### Check for Errors
1. Open Developer Tools (F12)
2. Go to Console tab
3. Should have no errors (warnings are OK)
4. Check for successful component renders

## Local Storage

### Verify User Data
1. Open Developer Tools (F12)
2. Go to Application → Local Storage → localhost:5174
3. Check "user" key
4. Should contain:
   ```json
   {
     "fullName": "John's Car Rentals",
     "email": "john@carrental.com",
     "phone": "+91 98765 43200",
     "businessName": "John's Car Rentals",
     "businessAddress": "123 Car Street, Mumbai, MH 400001",
     "registeredAt": "ISO-timestamp",
     "role": "vendor"
   }
   ```

## Known Test Scenarios

### ✅ Working Features
- User registration with role selection
- Auto-redirect to correct dashboard
- Sidebar navigation
- Modal windows open/close
- Filter functionality
- Status badges
- Responsive layout
- Form input handling
- Toggle switches
- All stat cards display

### 🔧 Future Development (Not Yet Implemented)
- Edit car functionality (button exists, no form)
- Delete account functionality
- File uploads for documents
- Real API integration
- Email notifications
- SMS notifications
- Payment processing
- Advanced search/sorting
- Export to CSV/PDF
- Real-time notifications

## Performance Tips

### Optimize Testing
- Clear browser cache if you see old styles
- Use Ctrl+Shift+R for hard refresh
- Check Network tab for load times
- Monitor Console for errors during navigation

## Troubleshooting

### Common Issues

**Issue**: Vendor pages not showing
- **Solution**: Make sure you registered as vendor, not customer
- **Check**: localStorage should have `"role": "vendor"`

**Issue**: Sidebar appears broken
- **Solution**: Browser zoom might be affecting layout
- **Check**: Zoom to 100% (Ctrl+0)

**Issue**: Styles look different
- **Solution**: CSS might not be fully loaded
- **Check**: Hard refresh page (Ctrl+Shift+R)

**Issue**: Can't navigate after logout
- **Solution**: localStorage is cleared, register again
- **Check**: localStorage should be empty after logout

---

## Summary Checklist

- [ ] Register as vendor successfully
- [ ] Dashboard loads with stats
- [ ] Can view all 5 cars
- [ ] Can filter cars by status
- [ ] Can view car details in modal
- [ ] Can view all bookings
- [ ] Can filter bookings by status
- [ ] Can view booking details
- [ ] Revenue chart is interactive
- [ ] Settings page loads
- [ ] Notification toggles work
- [ ] Sidebar navigation works
- [ ] Logout button works
- [ ] All colors/styles are applied
- [ ] Responsive on mobile (with work needed)

Enjoy testing your new Vendor Portal! 🚀
