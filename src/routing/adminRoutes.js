import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import authorize from "../middleware/roleMiddleware.js";
import db from "../prismaClient.js";

const router = express.Router();

// Get all transactions (Admin only)
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

// Get all bookings (Admin only)
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

export default router;
