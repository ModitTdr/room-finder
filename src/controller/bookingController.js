import {
  createBookingService,
  getMyBookingsService,
  getBookingByIdService,
  getReceivedBookingsService,
  updateBookingStatusService,
  cancelBookingService
} from '../services/bookingService.js';

export const createBooking = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request Body Missing" });
  }

  const { roomId, checkInDate, checkOutDate, message } = req.body;
  const userId = req.user.id;

  if (!roomId) {
    return res.status(400).json({ message: "Room ID is required" });
  }

  try {
    const booking = await createBookingService({
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      message
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await getMyBookingsService(req.user.id);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await getBookingByIdService(req.params.id, req.user.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Error fetching booking" });
  }
};

export const getReceivedBookings = async (req, res) => {
  try {
    const bookings = await getReceivedBookingsService(req.user.id);
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get received bookings error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, responseMessage } = req.body;

  if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const booking = await updateBookingStatusService(
      id,
      req.user.id,
      status,
      responseMessage
    );

    res.status(200).json({
      message: "Booking status updated",
      booking
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await cancelBookingService(req.params.id, req.user.id);

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(400).json({ message: error.message });
  }
};

export default {
  createBooking,
  getMyBookings,
  getBookingById,
  getReceivedBookings,
  updateBookingStatus,
  cancelBooking
};
