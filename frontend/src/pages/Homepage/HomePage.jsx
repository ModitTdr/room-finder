
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
      <div className='flex flex-col justify-center items-center w-full'>
         <div className='h-screen-hero z-1'>
            <HeroSection />
         </div>
         <div className='w-full h-fit overflow-hidden my-8'>
            <h1 className='text-2xl my-4'>Popular Rooms</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
               <div
                  className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 hover:scale-[1.02] smooth-transition h-[360px] box-shadow-md hover:border border-muted-foreground/25"
               >
                  <h2 className="text-xl font-semibold mb-2">Card</h2>
                  <p className="text-sm text-neutral-300">This is a responsive card.</p>
               </div>
               <div
                  className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 hover:scale-[1.02] smooth-transition h-[360px] box-shadow-md hover:border border-muted-foreground/25"
               >
                  <h2 className="text-xl font-semibold mb-2">Card</h2>
                  <p className="text-sm text-neutral-300">This is a responsive card.</p>
               </div>
               <div
                  className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 hover:scale-[1.02] smooth-transition h-[360px] box-shadow-md hover:border border-muted-foreground/25"
               >
                  <h2 className="text-xl font-semibold mb-2">Card</h2>
                  <p className="text-sm text-neutral-300">This is a responsive card.</p>
               </div>
               <div
                  className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 hover:scale-[1.02] smooth-transition h-[360px] box-shadow-md hover:border border-muted-foreground/25"
               >
                  <h2 className="text-xl font-semibold mb-2">Card</h2>
                  <p className="text-sm text-neutral-300">This is a responsive card.</p>
               </div>
            </div>

         </div>
      </div>
   )
}

export default HomePage