import { useState } from "react"
import { useAllRooms } from "@/hooks/rooms/useRooms"
import RoomCards from "@/components/RoomCards"
import RoomFilters from "@/components/RoomFilters"
import LoadingPage from "@/pages/LoadingPage"
import { Outlet } from "react-router"
import { motion } from "framer-motion"

const RoomsIndex = () => {
  const { data: rooms, isLoading } = useAllRooms();
  const [filteredRooms, setFilteredRooms] = useState([]);

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="container mx-auto py-8">
      {/* Filters Component */}
      <RoomFilters rooms={rooms} onFilteredRooms={setFilteredRooms} />

      {/* Rooms Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {filteredRooms && filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCards key={room.id} room={room} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">No rooms available matching your filters.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </motion.div>
      <Outlet />
    </div>
  )
}

export default RoomsIndex
