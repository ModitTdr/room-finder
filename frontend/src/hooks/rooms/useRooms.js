import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   createRoom,
   getMyRooms,
   getAllRooms,
   getRoomById,
   deleteRoom,
   updateRoom,
} from "@/services/roomServices.js";
import { toast } from "react-hot-toast";

/* ------- Create a new room ------- */
export const useCreateRoom = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createRoom,
      onSuccess: () => {
         toast.success("Room listed successfully!");
         queryClient.invalidateQueries({ queryKey: ["userRooms"] });
      },
      onError: (error) => {
         toast.error(error?.response?.data?.message || "Failed to list room");
      },
   });
};
/* ------- Get all rooms posted by logged-in user ------- */
export const useMyRooms = () => {
   return useQuery({
      queryKey: ["userRooms"],
      queryFn: getMyRooms,
   });
};
/* ------- Get all rooms  ------- */
export const useAllRooms = () => {
   return useQuery({
      queryKey: ["userRooms"],
      queryFn: getAllRooms,
   });
};
/* ------- Get single room by ID ------- */
export const useRoomById = (roomId) => {
   return useQuery({
      queryKey: ["room", roomId],
      queryFn: () => getRoomById(roomId),
      enabled: !!roomId,
   });
};
// /* ------- Delete a room ------- */
export const useDeleteRoom = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteRoom,
      onSuccess: () => {
         toast.success("Room deleted successfully");
         queryClient.invalidateQueries({ queryKey: ["userRooms"] });
      },
      onError: (error) => {
         toast.error("Failed to delete room");
      },
   });
};
// /* ------- Update a room ------- */
export const useUpdateRoom = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateRoom,
      onSuccess: () => {
         toast.success("Room updated successfully");
         queryClient.invalidateQueries({ queryKey: ["userRooms"] });
      },
      onError: (error) => {
         toast.error("Failed to update room");
         console.log(error)
      },
   });
};
