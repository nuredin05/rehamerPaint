import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and set user
      axios.get('http://localhost:3000/api/v1/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setUser(response.data.data.user);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
        identifier,
        password
      });

      const { user: userData, tokens } = response.data.data;
      setUser(userData);
      localStorage.setItem('token', tokens.accessToken);
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
