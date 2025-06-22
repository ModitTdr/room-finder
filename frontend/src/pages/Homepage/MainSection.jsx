import { featuredRooms } from '../../data'
import Cards from './Cards';
import {Button} from '@/components/ui/button'

const MainSection = () => {
   const rooms = featuredRooms;

   return (
      <div>
         <section className='py-18 container mx-auto text-center px-4 h-screen z-20'>
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
            <Button className="p-6 py-8 text-3xl font-bold bg-accent text-accent-foreground border hover:bg-accent-foreground hover:text-accent hover:border-accent">View All</Button>
         </section>
         
         <section className='container mx-auto text-center px-4 h-dvh flex flex-col justify-center items-center'>
            <div className="space-y-4 text-center mb-12">
               <h1 className='text-5xl md:text-7xl font-bold tracking-tighter'>GOT A ROOM TO 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent"> LIST</span>?
               </h1>
               <p className='text-lg font-light text-muted-foreground'>List your room today and, reach thousands of potential tenants quickly and easily.</p>
            </div>
            {/* cards */}
            <Button className="p-6 py-8 text-3xl font-bold bg-accent text-accent-foreground border hover:bg-accent-foreground hover:text-accent hover:border-accent">List Your Room</Button>
         </section>
      </div>
   )
}

export default MainSection