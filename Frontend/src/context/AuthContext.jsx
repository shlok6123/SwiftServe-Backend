import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      try {
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        // If the token is expired/invalid, logout
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.success) {
      await fetchUser(); // Fetches user and sets isAuthenticated
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) return null; // Or a loading spinner

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
