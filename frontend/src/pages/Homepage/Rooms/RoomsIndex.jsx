import { useAllRooms } from "@/hooks/rooms/useRooms"


import RoomCards from "@/components/RoomCards"
import LoadingPage from "@/pages/LoadingPage"
import { Outlet } from "react-router";

const RoomsIndex = () => {
   const { data: rooms, isLoading } = useAllRooms();
   if (isLoading) {
      return <LoadingPage />
   }
   // --- Most Important Debugging Step Here ---
   return (
      <div className="container mx-auto py-8">
         <div className="grid grid-cols-3 gap-3">
            {rooms && rooms.length > 0 ? (
               rooms.map((room) => (
                  <RoomCards key={room.id} room={room} />
               ))
            ) : (
               <p>No rooms available.</p>
            )}
         </div>
         <Outlet />
      </div>
   )
}

export default RoomsIndex