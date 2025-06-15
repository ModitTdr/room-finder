import React from 'react'

const HomePage = () => {
   return (
      <div className='flex justify-center items-center w-full h-full bg-neutral-800'>
         <div class="absolute inset-0 bg-hero"></div>
         <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
         <div class="absolute inset-0 backdrop-blur-xs"></div>
         <div className='max-w-[600px] mx-auto z-1'>
            <h1 className='text-4xl text-center my-6 w-[380px] mx-auto font-bold'>Your New City, Your Perfect Room!</h1>
            <p className='text-lg text-muted-foreground text-center'>Moving for study or work? Find your perfect room with ease. Our app helps you to find your dream room.</p>
         </div>
      </div>
   )
}

export default HomePage