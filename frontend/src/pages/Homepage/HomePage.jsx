
import HeroSection from './HeroSection'
import {
   Card,
   CardAction,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"

const HomePage = () => {
   return (
      <div>
         <HeroSection />
         <section className='py-18 container mx-auto text-center'>
            <h1 className='text-4xl'>Featured Rooms</h1>

         </section>
      </div>
   )
}

export default HomePage