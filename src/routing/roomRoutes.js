import express from "express";
import {
   createRoom,
   updateRoom,
   deleteRoom,
   getAllRooms,
   getRoomById,
   getMyRooms,
   getRoomWithReviews
} from "../controller/roomController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllRooms);
router.get("/:id", getRoomWithReviews);

// Protected Routes (OWNER only)
router.post("/", isLoggedIn, authorize("OWNER"), createRoom);
router.put("/:id", isLoggedIn, authorize("OWNER"), updateRoom);
router.delete("/:id", isLoggedIn, authorize("OWNER"), deleteRoom);
router.get("/me/rooms", isLoggedIn, authorize("OWNER"), getMyRooms);

export default router;
