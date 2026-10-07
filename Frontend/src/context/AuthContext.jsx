import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import orderSocket from '../services/orderSocket';
import Loader from '../components/Loader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    authService.logout();
    // Tear down the live order socket so a new session reconnects cleanly.
    orderSocket.disconnect();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
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
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.success) {
      await fetchUser(); // Fetches user and sets isAuthenticated
    }
    return response;
  };

  if (loading)
    return (
      <div style={{ minHeight: '100vh', display: 'flex' }}>
        <Loader center label="Warming up SwiftServe…" />
      </div>
    );

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
