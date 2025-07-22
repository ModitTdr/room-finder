import { Link } from "react-router";
import { featuredRooms } from "../../../data.js"
import Cards from './Cards';
import { Button } from '@/components/ui/button'

const MainSection = () => {
   const rooms = featuredRooms;

   return (
      <>
         <section className='py-18 container mx-auto text-center px-4 min-h-screen z-20'>
            <div className="space-y-4 text-center mb-12">
               <h1 className='text-5xl md:text-7xl font-bold tracking-tighter'>FEATURED
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent"> ROOMS
                  </span>
               </h1>
               <p className='text-lg font-light text-muted-foreground'>Discover rooms that fit your needs and budget, with options for every lifestyle.</p>
            </div>
            {/* cards */}
            <div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center mb-18'>
               <Cards rooms={rooms} />
            </div>
            <Button className="p-4 py-6 text-xl font-bold bg-accent text-accent-foreground border hover:bg-accent-foreground hover:text-accent hover:border-accent">
               <Link to="rooms">View All</Link>
            </Button>
         </section>

         <section className='container mx-auto text-center px-4 py-18'>
            <div className="space-y-4 text-center mb-12">
               <h1 className='text-5xl md:text-7xl font-bold tracking-tighter'>GOT A ROOM TO
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent"> LIST</span>?
               </h1>
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