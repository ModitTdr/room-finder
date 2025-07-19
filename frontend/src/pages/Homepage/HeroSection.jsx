import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
   const { isAuthenticated } = useAuth();
   return (
      <div className="relative h-screen-hero flex items-center overflow-hidden pt-18">

         <div className="absolute inset-0 bg-black">
            <div className='absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-950/85 to-transparent z-10'></div>
            <img src="/img.png" alt="" className='opacity-80 w-full h-full object-cover' />
         </div>

         <div className='relative z-20 container mx-auto px-4 text-white'>
            <div className='flex flex-col max-w-5xl 2xl:max-w-5xl gap-8'>
               <div className='flex flex-col gap-6'>
                  <h1 className='text-5xl md:text-7xl xl:text-8xl 2xl:text-9xl leading-14 md:leading-none md:tracking-tighter font-bold'>
                     YOUR NEW CITY,
                     <br />
                     <span>YOUR
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent"> PERFECT</span>
                     </span>
                     <br />
                     <span>ROOM!</span>
                  </h1>
                  <p className='text-lg font-light tracking-wide leading-tight'>Moving for study or work? Find your perfect room with ease. Our app helps you to find your dream room.</p>
               </div>

               <div className="flex gap-4 flex-wrap">
                  <Button className="w-full md:w-fit text-2xl px-8 py-6 text-accent-foreground bg-accent border rounded border-white/20 hover:text-accent hover:bg-accent-foreground">
                     {
                        isAuthenticated ? <Link to="/dashboard">Dashboard</Link> : <Link to="/login">Get Started</Link>
                     }
                  </Button>
                  <Button className="w-full md:w-fit text-2xl px-8 py-6 text-accent-foreground bg-accent border rounded border-white/20 hover:text-accent hover:bg-accent-foreground">Explore</Button>
               </div>

            </div>
         </div>


      </div>
   )
}

export default HeroSection