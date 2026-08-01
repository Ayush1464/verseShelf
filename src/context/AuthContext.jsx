import React, { createContext, useContext, useState } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('verseshelf_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password, role) => {
    try {
      const response = await API.post('/auth/login/', {
        email,
        password,
        role
      });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('verseshelf_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await API.post('/auth/register/', {
        name,
        email,
        password,
        role
      });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('verseshelf_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('verseshelf_user');
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return;
    try {
      const response = await API.put('/auth/profile/', {
        id: user.id,
        ...updatedFields
      });
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('verseshelf_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const addPurchasedBook = (bookId) => {
    if (user && user.role === 'reader') {
      const currentPurchases = user.purchasedBookIds || [];
      if (!currentPurchases.includes(bookId)) {
        const updatedUser = {
          ...user,
          purchasedBookIds: [...currentPurchases, bookId]
        };
        setUser(updatedUser);
        localStorage.setItem('verseshelf_user', JSON.stringify(updatedUser));
      }
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const response = await API.put('/auth/profile/', { id: user.id });
      setUser(response.data);
      localStorage.setItem('verseshelf_user', JSON.stringify(response.data));
    } catch (err) {
      console.error("Error refreshing profile balance:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role: user?.role || null, 
      login, 
      register, 
      logout, 
      updateProfile, 
      addPurchasedBook,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
