import { Link } from "react-router";
import { Button } from '@/components/ui/button'
import RoomCards from "@/components/RoomCards"
import { useAllRooms } from "@/hooks/rooms/useRooms"
import { Headset, LaptopMinimal, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import FeatureCard from "./components/FeatureCard"
import ReadMoreButton from "@/components/ReadMoreButton";

const MainSection = ({ recommendedRooms }) => {
  const { data: rooms } = useAllRooms();
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='py-18 container text-center px-4 z-20 m-auto'>
        <div className="flex items-center justify-between">
          <div className="text-start mb-12">
            <h2 className='text-5xl md:text-7xl font-bold tracking-tighter'>FEATURED
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent"> ROOMS
              </span>
            </h2>
            <p className='text-lg font-light text-muted-foreground'>Discover rooms that fit your needs and budget, with options for every lifestyle.</p>
          </div>
          <ReadMoreButton />
        </div>
        {/* cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 gap-y-8 mb-18'>
          {recommendedRooms && recommendedRooms.length > 0 ? (
            recommendedRooms.map((room) => (
              <RoomCards key={room.id} room={room} />
            ))
          ) : (
            rooms && rooms.length > 0 ? (
              rooms.map((room) => (
                <RoomCards key={room.id} room={room} />
              ))
            ) : <p className="text-start text-xl">Currently No Rooms Are Available :(</p>
          )}
        </div>
        <Button className="p-4 py-6 text-xl font-bold bg-accent text-accent-foreground border hover:bg-accent-foreground hover:text-accent hover:border-accent active:scale-95 smooth-transition lg:hidden ">
          <Link to="rooms">View All</Link>
        </Button>
      </motion.section>

      <section className='text-center bg-muted/30 pt-18'>
        <div className="space-y-4 text-center container mx-auto px-4">
          <h2 className='text-5xl md:text-7xl font-bold tracking-tighter'>Why Choose Room Finder?</h2>
          <p className="text-lg font-light text-muted-foreground">We make finding and renting rooms simple, safe, and reliable.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-18 container mx-auto px-4 py-18'>

          <FeatureCard
            Icon={LaptopMinimal}
            title="Easy to use"
            text="With our user-friendly interface, finding and booking rooms has never been easier."
            iconColor="text-blue-400"
            bgHover="hover:bg-blue-400/85"
          />
          <FeatureCard
            Icon={Sparkles}
            title="Smart Matching"
            text="Get personalized room suggestions based on your selected preferences, including budget, amenities, and location."
            iconColor="text-orange-400"
            bgHover="hover:bg-orange-400/85"
          />
          <FeatureCard
            Icon={Headset}
            title="Transparent Pricing"
            text="Our customer support team is available 24/7 to help you with any questions or concerns."
            iconColor="text-green-400"
            bgHover="hover:bg-green-400/85"
          />


        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className='container mx-auto text-center px-4 py-18'>
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
      </motion.section>
    </>
  )
}

export default MainSection
