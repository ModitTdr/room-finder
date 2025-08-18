import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const roomApi = axios.create({
   baseURL: API || "http://localhost:3000/api",
   withCredentials: true,
});

export async function getAllRooms() {
   const res = await roomApi.get(`/rooms`);
   return res.data
}
export async function createRoom(roomData) {
   const res = await roomApi.post("/rooms", roomData);
   return res.data
}
export async function getMyRooms() {
   const res = await roomApi.get(`/rooms/me/rooms`);
   return res.data
}
export async function getRoomWithSerivce(roomId) {
   const res = await roomApi.get(`/rooms/${roomId}`);
   return res.data;
}
export async function updateRoom(roomId, updatedData) {
   const res = await roomApi.put(`/rooms/${roomId}`, updatedData);
   return res.data;
}
export const deleteRoom = async (roomId) => {
   const res = await roomApi.delete(`/rooms/${roomId}`);
   return res.data;
};