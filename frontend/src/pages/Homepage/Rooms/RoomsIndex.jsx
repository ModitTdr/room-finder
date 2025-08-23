import { useAllRooms } from "@/hooks/rooms/useRooms"


import RoomCards from "@/components/RoomCards"
import LoadingPage from "@/pages/LoadingPage"
import { Outlet } from "react-router";
import { motion } from "framer-motion";

const RoomsIndex = () => {
   const { data: rooms, isLoading } = useAllRooms();
   if (isLoading) {
      return <LoadingPage />
   }
   // --- Most Important Debugging Step Here ---
   return (
      <div className="container mx-auto py-8">
         <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
         >
            {rooms && rooms.length > 0 ? (
               rooms.map((room) => (
                  <RoomCards key={room.id} room={room} />
               ))
            ) : (
               <p>No rooms available.</p>
            )}
         </motion.div>
         <Outlet />
      </div>
   )
}

export default RoomsIndex