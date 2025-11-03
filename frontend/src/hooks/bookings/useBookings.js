import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Create Booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await axiosInstance.post('/bookings', bookingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-bookings']);
    },
    onError: (error) => {
      console.error('Create booking error:', error);
    },
  });
};

// Get My Bookings (as Seeker)
export const useMyBookings = () => {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const response = await axiosInstance.get('/bookings/my-bookings');
      return response.data;
    },
  });
};

// Get Received Bookings (as Owner)
export const useReceivedBookings = () => {
  return useQuery({
    queryKey: ['received-bookings'],
    queryFn: async () => {
      const response = await axiosInstance.get('/bookings/received');
      return response.data;
    },
  });
};

// Get Booking by ID
export const useBookingById = (bookingId) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/bookings/${bookingId}`);
      return response.data;
    },
    enabled: !!bookingId,
  });
};

// Update Booking Status (Owner)
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status, responseMessage }) => {
      const response = await axiosInstance.patch(
        `/bookings/${bookingId}/status`,
        { status, responseMessage }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['received-bookings']);
      queryClient.invalidateQueries(['booking']);
    },
  });
};

// Cancel Booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId) => {
      const response = await axiosInstance.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-bookings']);
      queryClient.invalidateQueries(['booking']);
    },
  });
};
