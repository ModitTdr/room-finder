import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Initiate Payment
export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: async (bookingId) => {
      const response = await axiosInstance.post('/bookings/payment/initiate', {
        bookingId,
      });
      return response.data;
    },
    onError: (error) => {
      console.error('Payment initiation error:', error);
      throw error;
    },
  });
};

// Get Payment History
export const usePaymentHistory = () => {
  return useQuery({
    queryKey: ['payment-history'],
    queryFn: async () => {
      const response = await axiosInstance.get('/bookings/payment/history');
      return response.data;
    },
  });
};
