import { Button } from "@/components/ui/button"

const HeroSection = () => {
   return (
      <div className="relative h-screen-hero flex items-center overflow-hidden pt-18">

         <div className="absolute inset-0 bg-black">
            <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10'></div>
            <img src="../../../public/img.png" alt="" className='opacity-60 w-full h-full object-cover' />
         </div>

         <div className='relative z-20 container mx-auto px-4 text-white'>
            <div className='flex flex-col max-w-4xl gap-8'>
               <div className='flex flex-col gap-6'>
                  <h1 className='text-5xl md:text-7xl xl:text-8xl leading-14 md:leading-none md:tracking-tighter font-bold'>
                     YOUR NEW CITY,
                     <br />
                     <span>YOUR PERFECT</span>
                     <br />
                     <span>ROOM!</span>
                  </h1>
                  <p className='text-lg font-light tracking-wide leading-tight'>Moving for study or work? Find your perfect room with ease. Our app helps you to find your dream room.</p>
               </div>

               <Button className="w-full md:w-fit text-2xl px-8 py-6 text-white bg-black/60 backdrop-blur-sm border rounded border-white/50 hover:text-black hover:bg-white">Explore</Button>

            </div>
         </div>


      </div>
   )
}

export default HeroSection