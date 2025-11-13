import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import authorize from "../middleware/roleMiddleware.js";
import db from "../prismaClient.js";

const router = express.Router();

router.get(
  "/transactions",
  isLoggedIn,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const transactions = await db.payment.findMany({
        include: {
          booking: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              room: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  address: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Error fetching transactions" });
    }
  }
);

// Cleanup old pending transactions (Admin only)
router.delete(
  "/transactions/cleanup",
  isLoggedIn,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const deletedTransactions = await db.payment.deleteMany({
        where: {
          status: {
            in: ['PENDING', 'FAILED']
          },
          createdAt: {
            lt: oneHourAgo
          }
        }
      });

      res.status(200).json({
        message: "Old pending/failed transactions cleaned up",
        deleted: deletedTransactions.count
      });
    } catch (error) {
      console.error("Cleanup error:", error);
      res.status(500).json({ message: "Error cleaning up transactions" });
    }
  }
);

router.get(
  "/bookings",
  isLoggedIn,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const bookings = await db.booking.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          room: {
            select: {
              id: true,
              title: true,
              price: true,
              address: true,
            },
          },
        },
        orderBy: {
          bookedAt: "desc",
        },
      });

      res.status(200).json(bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  }
);

router.patch(
  "/rooms/:roomId/toggle-availability",
  isLoggedIn,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const { roomId } = req.params;

      const room = await db.room.findUnique({
        where: { id: roomId }
      });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const updatedRoom = await db.room.update({
        where: { id: roomId },
        data: {
          available: !room.available
        }
      });

      res.status(200).json({
        message: `Room ${updatedRoom.available ? 'marked as available' : 'marked as unavailable'}`,
        room: updatedRoom
      });
    } catch (error) {
      console.error("Toggle availability error:", error);
      res.status(500).json({ message: "Error toggling room availability" });
    }
  }
);

router.delete(
  "/rooms/:roomId",
  isLoggedIn,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const { roomId } = req.params;

      const room = await db.room.findUnique({
        where: { id: roomId }
      });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Delete associated bookings and payments first
      await db.payment.deleteMany({
        where: {
          booking: {
            roomId: roomId
          }
        }
      });

      await db.booking.deleteMany({
        where: { roomId: roomId }
      });

      await db.favorite.deleteMany({
        where: { roomId: roomId }
      });

      await db.review.deleteMany({
        where: { roomId: roomId }
      });

      // Finally delete the room
      await db.room.delete({
        where: { id: roomId }
      });

      res.status(200).json({
        message: "Room and all associated data deleted successfully"
      });
    } catch (error) {
      console.error("Delete room error:", error);
      res.status(500).json({ message: "Error deleting room" });
    }
  }
);

export default router;
