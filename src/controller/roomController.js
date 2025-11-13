import {
  createRoomService,
  updateRoomService,
  deleteRoomService,
  getAllRoomsService,
  getRoomByIdService,
  getMyRoomsService,
  getRoomWithReviewsService,
} from "../services/roomService.js";
import { roomSchema } from "../utils/roomSchema.js";

export const createRoom = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(400).json({ message: "Request Body Missing" })

  try {
    const validated = roomSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ message: validated.error.errors[0].message });
    }
    const response = await createRoomService(req.user.id, validated.data);
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create room" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await getAllRoomsService();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await getRoomByIdService(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room" });
  }
};

export const getRoomWithReviews = async (req, res) => {
  try {
    const room = await getRoomWithReviewsService(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room reviews" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const validated = roomSchema.partial().safeParse(req.body); // partial for PATCH-style update
    if (!validated.success) {
      return res.status(400).json({ message: validated.error.errors[0].message });
    }

    const updated = await updateRoomService(req.params.id, req.user.id, validated.data);
    if (!updated) return res.status(403).json({ message: "Unauthorized or room not found" });

    res.status(200).json({ message: "Room updated", updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update room" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const deleted = await deleteRoomService(req.params.id, req.user.id);
    if (!deleted) return res.status(403).json({ message: "Unauthorized or room not found" });

    res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room" });
  }
};

export const getMyRooms = async (req, res) => {
  try {
    const rooms = await getMyRoomsService(req.user.id);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your rooms" });
  }
};

export const toggleRoomAvailability = async (req, res) => {
  try {
    const room = await getRoomByIdService(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedRoom = await updateRoomService(
      req.params.id,
      req.user.id,
      { available: !room.available }
    );

    res.status(200).json({
      message: `Room ${updatedRoom.available ? 'marked as available' : 'marked as unavailable'}`,
      room: updatedRoom
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle room availability" });
  }
};

export default {
  createRoom,
  getAllRooms,
  getRoomWithReviews,
  getRoomById,
  updateRoom,
  deleteRoom,
  getMyRooms,
  toggleRoomAvailability,
};
