import db from "../prismaClient.js";

export const createRoomService = async (ownerId, roomData) => {
   const room = await db.room.create({
      data: {
         ...roomData,
         ownerId,
      },
   });
   return room;
};

export const getAllRoomsService = async () => {
   const rooms = await db.room.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
   });
   return rooms;
};

export const getRoomByIdService = async (roomId) => {
   const room = await db.room.findUnique({
      where: { id: roomId },
   });
   return room;
};

export const updateRoomService = async (roomId, ownerId, data) => {
   const existingRoom = await db.room.findUnique({ where: { id: roomId } });

   if (!existingRoom || existingRoom.ownerId !== ownerId) {
      return null;
   }

   const updatedRoom = await db.room.update({
      where: { id: roomId },
      data,
   });

   return updatedRoom;
};

export const deleteRoomService = async (roomId, ownerId) => {
   const room = await db.room.findUnique({ where: { id: roomId } });

   if (!room || room.ownerId !== ownerId) {
      return null;
   }

   await db.room.delete({ where: { id: roomId } });
   return true;
};

export const getMyRoomsService = async (ownerId) => {
   const rooms = await db.room.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
   });
   return rooms;
};

export default {
   createRoomService,
   getAllRoomsService,
   getRoomByIdService,
   updateRoomService,
   deleteRoomService,
   getMyRoomsService,
};
