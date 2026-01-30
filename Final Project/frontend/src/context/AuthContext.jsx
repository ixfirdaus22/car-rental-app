import { createContext, useState } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Use lazy initialization to avoid setState in useEffect
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage only once during initial render
    try {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      
      if (storedUser && storedToken) {
        return JSON.parse(storedUser)
      }
    } catch (error) {
      console.error("Failed to parse user data", error)
      localStorage.clear() // Clear corrupted data
    }
    return null
  })
  
  // Loading is false since localStorage access is synchronous
  const [loading] = useState(false)

  // 2. Login: Only called AFTER Backend gives us a Token
  const login = (userData) => {
    setUser(userData)
    if (userData.token) localStorage.setItem('token', userData.token);
    if (userData.jwt) localStorage.setItem('token', userData.jwt);
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 3. Logout: Clears everything
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token') // CRITICAL: Remove the security key
    window.location.href = '/login'
  }



  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}