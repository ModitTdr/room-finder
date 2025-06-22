import React from 'react'
import { Button } from '@/components/ui/button'

const Cards = ({ rooms }) => {
    return rooms.map((room) => (
        <div key={room.id} className="w-full overflow-hidden border border-accent shadow-lg rounded-xl hover:scale-103 smooth-transition cursor-pointer">
            <div className='w-full h-48 drop-shadow-lg'>
                <img src={room.image} className='w-full h-full object-cover rounded-xl' alt={room.title} />
            </div>

            <div className='p-3'>
                <div className='text-start mb-5'>
                    <h1 className='text-xl mb-2'>{room.title}</h1>
                    <p>{room.location}</p>
                </div>

                <div className='mb-5'>
                    <ul className='flex gap-2'>
                        {
                            room.features.map((item, index) => (
                                index !== 3 &&
                                <li key={index+item} className='py-1 px-3 border shadow-sm'>
                                    {item}
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className='flex justify-between items-center'>
                    <h2 className='font-bold text-2xl text-accent'>${room.price}</h2>
                    <Button className="border bg-accent text-accent-foreground">
                        Rent Now
                    </Button>
                </div>

            </div>
        </div>
    ))
}

export default Cards