import db from "../prismaClient.js";

export const createBookingService = async (bookingData) => {
  const { userId, roomId, checkInDate, checkOutDate, message } = bookingData;

  // Check if room exists and is available
  const room = await db.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new Error('Room not found');
  }

  if (!room.available) {
    throw new Error('Room is not available');
  }

  // Check if user already has a pending or accepted booking for this room
  const existingBooking = await db.booking.findFirst({
    where: {
      userId,
      roomId,
      status: {
        in: ['PENDING', 'ACCEPTED']
      }
    }
  });

  if (existingBooking) {
    throw new Error('You already have an active booking for this room');
  }

  // Create the booking
  const booking = await db.booking.create({
    data: {
      userId,
      roomId,
      checkInDate: checkInDate ? new Date(checkInDate) : null,
      checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
      message,
      status: 'PENDING'
    },
    include: {
      room: {
        select: {
          id: true,
          title: true,
          price: true,
          address: true,
          images: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return booking;
};

export const getMyBookingsService = async (userId) => {
  const bookings = await db.booking.findMany({
    where: { userId },
    include: {
      room: {
        select: {
          id: true,
          title: true,
          price: true,
          address: true,
          images: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: { bookedAt: 'desc' }
  });

  return bookings;
};

export const getBookingByIdService = async (bookingId, userId) => {
  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
      userId
    },
    include: {
      room: {
        select: {
          id: true,
          title: true,
          price: true,
          address: true,
          images: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: {
                select: {
                  phone: true
                }
              }
            }
          }
        }
      }
    }
  });

  return booking;
};

export const getReceivedBookingsService = async (ownerId) => {
  const bookings = await db.booking.findMany({
    where: {
      room: {
        ownerId
      }
    },
    include: {
      room: {
        select: {
          id: true,
          title: true,
          price: true,
          address: true,
          images: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: {
            select: {
              phone: true
            }
          }
        }
      }
    },
    orderBy: { bookedAt: 'desc' }
  });

  return bookings;
};

export const updateBookingStatusService = async (bookingId, ownerId, status, responseMessage) => {
  // Verify the booking belongs to a room owned by this owner
  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
      room: {
        ownerId
      }
    }
  });

  if (!booking) {
    throw new Error('Booking not found or unauthorized');
  }

  if (booking.status !== 'PENDING') {
    throw new Error('Can only update pending bookings');
  }

  const updatedBooking = await db.booking.update({
    where: { id: bookingId },
    data: {
      status,
      responseMessage,
      respondedAt: new Date()
    },
    include: {
      room: {
        select: {
          id: true,
          title: true,
          price: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return updatedBooking;
};

export const cancelBookingService = async (bookingId, userId) => {
  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
      userId
    }
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
    throw new Error('Cannot cancel this booking');
  }

  const cancelledBooking = await db.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CANCELLED'
    }
  });

  return cancelledBooking;
};

export default {
  createBookingService,
  getMyBookingsService,
  getBookingByIdService,
  getReceivedBookingsService,
  updateBookingStatusService,
  cancelBookingService
};
