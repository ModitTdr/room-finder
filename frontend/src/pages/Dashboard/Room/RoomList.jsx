import RoomListCards from "./RoomListCards"
import { useMyRooms } from "@/hooks/rooms/useRooms"

const RoomList = () => {
   const { data: myrooms } = useMyRooms();
   console.log(myrooms)
   return (
      <div className="container mx-auto p-8 space-y-6">
         {/* ------------- header ------------- */}
         <div className="">
            <h1 className="text-3xl font-bold text-foreground">
               My Rooms
            </h1>
            <p className="text-muted-foreground">
               Manage your property listings and track performance
            </p>
         </div>
         <div
            id="cards-wrapper"
            className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-fit mx-auto"
         >
            {myrooms && myrooms.length > 0 ? (
               myrooms.map((room) => (
                  <RoomListCards key={room.id} room={room} />
               ))
            ) : (
               <p>No rooms available.</p>
            )}
         </div>
      </div>
   )
}

export default RoomList