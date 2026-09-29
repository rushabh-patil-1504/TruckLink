import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('trucklink_token') || '');
  const [loading, setLoading] = useState(true);

  // Fetch logged in user details on init
  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('[Auth Error] Token invalid or expired:', error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token]);

  const login = async (identifier, password) => {
    const res = await API.post('/auth/login', { identifier, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('trucklink_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (registrationData) => {
    const res = await API.post('/auth/register', registrationData);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('trucklink_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const switchRole = async (targetRole) => {
    try {
      const res = await API.post('/auth/switch-role', { targetRole });
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (error) {
      if (error.response && error.response.data && error.response.data.hasProfile === false) {
        return { success: false, hasProfile: false, message: error.response.data.message };
      }
      throw error;
    }
  };

  const createLinkedProfile = async (profileData) => {
    const res = await API.post('/auth/create-linked-profile', profileData);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('trucklink_token');
    setToken('');
    setUser(null);
  };

  const updateLocalUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        switchRole,
        createLinkedProfile,
        logout,
        updateLocalUser,
        isAuthenticated: !!user,
        activeRole: user ? user.activeRole || user.role : null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
