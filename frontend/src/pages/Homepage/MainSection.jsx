import { Link } from "react-router";
import { Button } from '@/components/ui/button'
import RoomCards from "@/components/RoomCards"
import { useAllRooms } from "@/hooks/rooms/useRooms"

const MainSection = ({ recommendedRooms }) => {
   const { data: rooms } = useAllRooms();
   return (
      <>
         <section className='py-18 container text-center px-4 z-20 m-auto'>
            <div className="space-y-4 text-center mb-12">
               <h2 className='text-5xl md:text-7xl font-bold tracking-tighter'>FEATURED
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent"> ROOMS
                  </span>
               </h2>
               <p className='text-lg font-light text-muted-foreground'>Discover rooms that fit your needs and budget, with options for every lifestyle.</p>
            </div>
            {/* cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-18'>
               {recommendedRooms && recommendedRooms.length > 0 ? (
                  recommendedRooms.map((room) => (
                     <RoomCards key={room.id} room={room} />
                  ))
               ) : (
                  rooms && rooms.length > 0 ? (
                     rooms.map((room) => (
                        <RoomCards key={room.id} room={room} />
                     ))
                  ) : <p>No Rooms Available</p>
               )}
            </div>
            <Button className="p-4 py-6 text-xl font-bold bg-accent text-accent-foreground border hover:bg-accent-foreground hover:text-accent hover:border-accent">
               <Link to="rooms">View All</Link>
            </Button>
         </section>

         <section className='container mx-auto text-center px-4 py-18'>
            <div className="space-y-4 text-center mb-12">
               <h2 className='text-5xl md:text-7xl font-bold tracking-tighter'>GOT A ROOM TO
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent"> LIST</span>?
               </h2>
               <p className='text-lg font-light text-muted-foreground'>List your room today and, reach thousands of potential tenants quickly and easily.</p>
            </div>
            {/* cards */}
            <Button className="p-4 py-6 text-xl font-bold bg-accent text-accent-foreground border hover:bg-accent-foreground hover:text-accent hover:border-accent">
               <Link to="dashboard/addroom">List Your Room</Link>
            </Button>
         </section>
      </>
   )
}

export default MainSection