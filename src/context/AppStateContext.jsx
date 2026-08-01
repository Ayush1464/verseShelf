import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [commissionRate, setCommissionRate] = useState(20);
  const [loading, setLoading] = useState(true);

  // Fetch all initial configurations from Django API on mount
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [booksRes, ordersRes, withdrawalsRes, settingsRes] = await Promise.all([
        API.get('/books/'),
        API.get('/orders/'),
        API.get('/withdrawals/'),
        API.get('/settings/')
      ]);

      setBooks(booksRes.data);
      setOrders(ordersRes.data);
      setWithdrawals(withdrawalsRes.data);
      setCommissionRate(settingsRes.data.commission_rate);
    } catch (error) {
      console.error("Error loading VerseShelf state from server:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync actions to Django API
  const addBook = async (newBook) => {
    try {
      const response = await API.post('/books/', newBook, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const createdBook = response.data;
      setBooks(prev => [createdBook, ...prev]);
      return createdBook;
    } catch (error) {
      console.error("Failed to upload book to Django:", error);
      throw error;
    }
  };

  const approveBook = async (bookId) => {
    try {
      const response = await API.put(`/books/${bookId}/approve/`);
      const updatedBook = response.data;
      setBooks(prev => prev.map(b => b.id === bookId ? updatedBook : b));
      return updatedBook;
    } catch (error) {
      console.error("Failed to approve book:", error);
      throw error;
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await API.delete(`/books/${bookId}/`);
      setBooks(prev => prev.filter(b => b.id !== bookId));
    } catch (error) {
      console.error("Failed to delete book:", error);
      throw error;
    }
  };

  const updateCommissionRate = async (newRate) => {
    try {
      const response = await API.put('/settings/', { commission_rate: newRate });
      setCommissionRate(response.data.commission_rate);
      return response.data.commission_rate;
    } catch (error) {
      console.error("Failed to update commission rate:", error);
      throw error;
    }
  };

  const requestWithdrawal = async (authorId, authorName, amount, accountDetails) => {
    try {
      const response = await API.post('/withdrawals/', {
        authorId,
        amount,
        accountDetails
      });
      const newRequest = response.data;
      setWithdrawals(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (error) {
      console.error("Failed to file withdrawal request:", error);
      throw error;
    }
  };

  const approveWithdrawal = async (id) => {
    try {
      const response = await API.put(`/withdrawals/${id}/approve/`);
      const updatedRequest = response.data;
      setWithdrawals(prev => prev.map(w => w.id === id ? updatedRequest : w));
      return updatedRequest;
    } catch (error) {
      console.error("Failed to approve withdrawal request:", error);
      throw error;
    }
  };

  return (
    <AppStateContext.Provider value={{
      books,
      orders,
      withdrawals,
      commissionRate,
      loading,
      addBook,
      approveBook,
      deleteBook,
      updateCommissionRate,
      requestWithdrawal,
      approveWithdrawal,
      refreshData: fetchAllData
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
