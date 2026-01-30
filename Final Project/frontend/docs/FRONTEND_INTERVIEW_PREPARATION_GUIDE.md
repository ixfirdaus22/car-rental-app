# Frontend Interview Preparation Guide

This comprehensive guide covers all concepts, patterns, and implementation details across all frontend modules. Use this for interview preparation and understanding the complete frontend system.

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Core React Concepts](#core-react-concepts)
4. [Module-by-Module Concepts](#module-by-module-concepts)
5. [Common Interview Questions](#common-interview-questions)
6. [Code Examples](#code-examples)
7. [Best Practices](#best-practices)

---

## System Overview

### Technology Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Charts**: Recharts
- **Styling**: Bootstrap 5
- **Storage**: localStorage

### Architecture
- **Component-based**: Reusable components
- **Single Page Application (SPA)**: Client-side routing
- **RESTful API integration**: Backend communication
- **Role-based routing**: Different layouts for different roles

---

## Technology Stack

### React 19
- **Hooks**: useState, useEffect, useContext, useNavigate, useParams
- **Components**: Functional components
- **State**: Component state and Context API
- **Lifecycle**: useEffect for side effects

### React Router DOM
- **Routes**: Declarative routing
- **Navigation**: Programmatic and declarative
- **Layouts**: Nested routes with layouts
- **State passing**: Location state for data passing

### Axios
- **HTTP client**: Promise-based HTTP client
- **Interceptors**: Request/response interceptors
- **Error handling**: Comprehensive error handling
- **Configuration**: Base URL and default headers

---

## Core React Concepts

### 1. **Hooks**

#### useState
```javascript
const [state, setState] = useState(initialValue);
const [state, setState] = useState(() => initialValue); // Lazy initialization
```

#### useEffect
```javascript
// On mount
useEffect(() => {
  fetchData();
}, []);

// On dependency change
useEffect(() => {
  fetchData();
}, [userId]);

// Cleanup
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

#### useContext
```javascript
const { user, login, logout } = useContext(AuthContext);
```

#### useNavigate
```javascript
const navigate = useNavigate();
navigate('/path');
navigate('/path', { state: { data } });
```

#### useParams
```javascript
const { carId } = useParams(); // From /car/:carId
```

#### useLocation
```javascript
const location = useLocation();
const data = location.state?.car;
```

---

### 2. **State Management**

#### Component State
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

#### Context API
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

#### localStorage
```javascript
// Store
localStorage.setItem('key', JSON.stringify(data));

// Retrieve
const data = JSON.parse(localStorage.getItem('key'));

// Remove
localStorage.removeItem('key');
```

---

### 3. **API Integration**

#### Axios Configuration
```javascript
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### API Calls
```javascript
// GET
const response = await api.get('/endpoint');

// POST
const response = await api.post('/endpoint', data);

// PUT
const response = await api.put('/endpoint', data);

// DELETE
const response = await api.delete('/endpoint');
```

---

## Module-by-Module Concepts

### Authentication Module
**Key Concepts**:
- React Context API for global auth state
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
// Create
const Context = createContext();

// Provide
<Context.Provider value={value}>
  <App />
</Context.Provider>

// Consume
const value = useContext(Context);
```

---

**Q: "What's the difference between useState and useReducer?"**
**A**: 
- **useState**: Simple state (single value/object)
- **useReducer**: Complex state (multiple actions, complex logic)

**When to use useReducer?**
- Complex state logic
- Multiple state updates
- State updates depend on previous state

---

**Q: "How do you handle API calls in React?"**
**A**: 
Use useEffect for API calls:
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

**Q: "Explain React Router navigation."**
**A**: 
```javascript
// Declarative
<Link to="/path">Navigate</Link>

// Programmatic
const navigate = useNavigate();
navigate('/path');
navigate('/path', { state: { data } });
```

---

**Q: "How do you handle form validation in React?"**
**A**: 
1. **HTML5 validation**: `required`, `type="email"`
2. **State validation**: Validate before submission
3. **Library**: Formik, React Hook Form

---

**Q: "What's the difference between controlled and uncontrolled components?"**
**A**: 
- **Controlled**: Input value controlled by state
  ```javascript
  <input value={value} onChange={e => setValue(e.target.value)} />
  ```
- **Uncontrolled**: Input value managed by DOM
  ```javascript
  <input ref={inputRef} />
  ```

---

## Code Examples

### Complete Authentication Flow
```javascript
// Login
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await login({ email, password });
    localStorage.setItem('token', response.data.token);
    authLogin(response.data);
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};

// Protected route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
```

---

### Data Fetching Pattern
```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

---

### Form Handling Pattern
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: ''
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('/endpoint', formData);
    alert('Success');
  } catch (err) {
    setError(err.message);
  }
};

<form onSubmit={handleSubmit}>
  <input
    value={formData.name}
    onChange={e => setFormData({ ...formData, name: e.target.value })}
  />
  <button type="submit">Submit</button>
</form>
```

---

## Best Practices

### 1. **State Management**
- ✅ Use useState for local component state
- ✅ Use Context API for global state (auth)
- ✅ Use localStorage for persistence
- ✅ Keep state as close to where it's used as possible

---

### 2. **API Calls**
- ✅ Use useEffect for data fetching
- ✅ Handle loading and error states
- ✅ Use try-catch for error handling
- ✅ Clean up subscriptions in useEffect cleanup

---

### 3. **Error Handling**
- ✅ Try-catch for async operations
- ✅ User-friendly error messages
- ✅ Handle different error types (401, 403, 500)
- ✅ Show loading states during API calls

---

### 4. **Performance**
- ✅ Use useMemo for expensive calculations
- ✅ Use useCallback for function memoization
- ✅ Lazy load components with React.lazy
- ✅ Optimize re-renders with React.memo

---

### 5. **Code Quality**
- ✅ Extract reusable components
- ✅ Use custom hooks for reusable logic
- ✅ Consistent naming conventions
- ✅ Proper error handling
- ✅ Loading states for better UX

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
- **Loading**: `const [loading, setLoading] = useState(false)`
- **Error**: `const [error, setError] = useState('')`
- **Data fetch**: `useEffect(() => { fetchData() }, [])`
- **Form**: Controlled components with state
- **Modal**: State for selected item

### API Patterns
- **GET**: `await api.get('/endpoint')`
- **POST**: `await api.post('/endpoint', data)`
- **PUT**: `await api.put('/endpoint', data)`
- **DELETE**: `await api.delete('/endpoint')`

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

**Use this guide along with individual module documentation files for comprehensive interview preparation.**
