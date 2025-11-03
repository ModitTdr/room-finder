import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import authorize from "../middleware/roleMiddleware.js";
import bookingController from "../controller/bookingController.js";
import paymentController from "../controller/paymentController.js";

const router = express.Router();

// Booking Routes
router.post("/", isLoggedIn, bookingController.createBooking);
router.get("/my-bookings", isLoggedIn, bookingController.getMyBookings);
router.get("/received", isLoggedIn, authorize("OWNER"), bookingController.getReceivedBookings);
router.get("/:id", isLoggedIn, bookingController.getBookingById);
router.patch("/:id/status", isLoggedIn, authorize("OWNER"), bookingController.updateBookingStatus);
router.patch("/:id/cancel", isLoggedIn, bookingController.cancelBooking);

// Payment Routes
router.post("/payment/initiate", isLoggedIn, paymentController.initiatePayment);
router.get("/payment/verify", paymentController.verifyPayment);
router.get("/payment/history", isLoggedIn, paymentController.getPaymentHistory);

export default router;
