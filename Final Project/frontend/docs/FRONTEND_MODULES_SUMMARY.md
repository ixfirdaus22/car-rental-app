# Frontend Modules - Comprehensive Concept Summary

This document provides a quick reference guide to all concepts used across different frontend modules in the car rental system. Use this for interview preparation and understanding the frontend technical stack.

---

## Table of Contents
1. [Core Concepts Across All Modules](#core-concepts-across-all-modules)
2. [Module-Specific Concepts](#module-specific-concepts)
3. [Common Interview Questions](#common-interview-questions)

---

## Core Concepts Across All Modules

### 1. **React Hooks**
- **useState**: Component state management
- **useEffect**: Side effects (API calls, subscriptions)
- **useContext**: Access context values
- **useNavigate**: Programmatic navigation
- **useParams**: Extract route parameters
- **useLocation**: Access location and state

### 2. **React Router**
- **Routes**: Route definitions
- **Route**: Individual route
- **Navigate**: Programmatic navigation
- **Outlet**: Render child routes (layouts)
- **useParams**: Route parameters
- **useLocation**: Location and state

### 3. **State Management**
- **Context API**: Global state (authentication)
- **Component State**: Local component state
- **localStorage**: Persistent storage (tokens, user data)

### 4. **API Integration**
- **Axios**: HTTP client
- **Interceptors**: Automatic token injection
- **Error Handling**: Try-catch with user feedback

### 5. **Form Handling**
- **Controlled Components**: State-controlled inputs
- **Form Validation**: Client-side validation
- **Form Submission**: Async form handling

### 6. **UI Patterns**
- **Loading States**: Spinners during API calls
- **Error States**: Error messages
- **Empty States**: No data messages
- **Modals**: Detail views
- **Tabs**: Content organization

---

## Module-Specific Concepts

### Authentication Module
**Key Concepts**:
- React Context API for auth state
- localStorage for token persistence
- Axios interceptors for automatic token injection
- Role-based navigation
- Controlled form components

**Interview Questions**:
- How does authentication state management work?
- How do you handle token expiration?
- Explain the Axios interceptor pattern

---

### Cars Module
**Key Concepts**:
- useParams for route parameters
- useLocation for state data
- Data transformation (backend to frontend)
- Client-side filtering
- Image path resolution

**Interview Questions**:
- How do you handle data transformation?
- Explain useParams and useLocation hooks
- How do you implement client-side filtering?

---

### Bookings Module
**Key Concepts**:
- Tab-based UI (Current/Past)
- Modal pattern for details
- Date formatting
- Status-based filtering
- Confirmation dialogs

**Interview Questions**:
- How do you implement tab-based navigation?
- How do you handle modal state management?
- How do you format dates in React?

---

### Payment Module
**Key Concepts**:
- Date selection with validation
- Price calculation (useMemo)
- Sequential API calls
- Transaction ID generation
- Multi-step forms

**Interview Questions**:
- How do you handle sequential API calls?
- How do you calculate prices dynamically?
- How do you prevent form double submission?

---

### Profile Module
**Key Concepts**:
- Profile data fetching
- Form pre-population
- Password update with verification
- Account deletion with confirmation
- Context state synchronization

**Interview Questions**:
- How do you handle profile updates?
- How do you handle password changes securely?

---

### Reviews Module
**Key Concepts**:
- Review submission form
- Star rating component
- Review display with filtering
- Average rating calculation

**Interview Questions**:
- How do you implement star rating?
- How do you calculate average rating?

---

### Complaints Module
**Key Concepts**:
- Complaint submission form
- Status-based display
- Complaint history

**Interview Questions**:
- How do you handle complaint submission?

---

### Admin Module
**Key Concepts**:
- Data visualization (Recharts)
- Tab-based filtering
- Search functionality
- Modal pattern
- Bulk operations

**Interview Questions**:
- How do you create data visualizations?
- How do you implement search functionality?

---

### Vendor Module
**Key Concepts**:
- Layout component pattern
- Dashboard statistics
- File upload pattern
- Data aggregation client-side

**Interview Questions**:
- How do you handle file uploads?
- How do you fetch multiple API endpoints in parallel?

---

## Common Interview Questions

### General Questions

**Q: "Explain React Context API."**
**A**: 
Context API provides a way to share state across components without prop drilling:
```javascript
// Create context
const AuthContext = createContext();

// Provide context
<AuthContext.Provider value={{ user, login, logout }}>
  <App />
</AuthContext.Provider>

// Consume context
const { user } = useContext(AuthContext);
```

---

**Q: "How do you handle API calls in React?"**
**A**: 
Use useEffect for API calls on mount:
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };
  fetchData();
}, []);
```

---

**Q: "What's the difference between useState and useReducer?"**
**A**: 
- **useState**: Simple state management (single value/object)
- **useReducer**: Complex state management (multiple actions, complex logic)

**When to use useReducer?**
- Complex state logic
- Multiple state updates
- State updates depend on previous state

---

**Q: "How do you handle form validation in React?"**
**A**: 
1. **HTML5 validation**: Use `required`, `type="email"`, etc.
2. **State validation**: Validate in state before submission
3. **Library**: Use Formik, React Hook Form for complex validation

---

**Q: "Explain React Router navigation."**
**A**: 
```javascript
// Declarative navigation
<Link to="/path">Navigate</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate('/path');
navigate('/path', { state: { data } }); // With state
```

---

## Quick Reference

### React Hooks
- **useState**: `const [state, setState] = useState(initial)`
- **useEffect**: `useEffect(() => { ... }, [deps])`
- **useContext**: `const value = useContext(Context)`
- **useNavigate**: `const navigate = useNavigate()`
- **useParams**: `const { id } = useParams()`
- **useLocation**: `const location = useLocation()`

### Common Patterns
- **Loading state**: `const [loading, setLoading] = useState(false)`
- **Error state**: `const [error, setError] = useState('')`
- **Data fetching**: `useEffect(() => { fetchData() }, [])`
- **Form handling**: Controlled components with state
- **Modal**: State for selected item + modal component

### API Patterns
- **GET request**: `await api.get('/endpoint')`
- **POST request**: `await api.post('/endpoint', data)`
- **PUT request**: `await api.put('/endpoint', data)`
- **DELETE request**: `await api.delete('/endpoint')`
- **Error handling**: `try-catch` with user feedback

---

## Study Checklist

### Must Know:
- [ ] React Hooks (useState, useEffect, useContext)
- [ ] React Router (navigation, params, location)
- [ ] Context API for state management
- [ ] Axios and interceptors
- [ ] Form handling patterns
- [ ] Error handling
- [ ] Loading states

### Module-Specific:
- [ ] Authentication: Context API, localStorage, interceptors
- [ ] Cars: useParams, useLocation, data transformation
- [ ] Bookings: Tabs, modals, date formatting
- [ ] Payment: Sequential API calls, price calculation
- [ ] Profile: Form pre-population, password update
- [ ] Reviews: Star rating, average calculation
- [ ] Admin: Charts, search, filtering
- [ ] Vendor: File upload, dashboard stats

---

**Last Updated**: January 2026
