import React from 'react'

const Featured = () => {
   const featuredRooms = [
      {
         id: '1',
         title: 'LUXURY DOWNTOWN SUITE',
         location: 'New York, NY',
         price: 150,
         rating: 4.9,
         reviews: 127,
         image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
         features: ['WiFi', 'Kitchen', 'AC', 'Parking']
      },
      {
         id: '2',
         title: 'OCEANFRONT PENTHOUSE',
         location: 'Malibu, CA',
         price: 200,
         rating: 4.8,
         reviews: 89,
         image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
         features: ['Ocean View', 'Pool', 'WiFi', 'Pet Friendly']
      },
      {
         id: '3',
         title: 'MODERN URBAN LOFT',
         location: 'San Francisco, CA',
         price: 120,
         rating: 4.7,
         reviews: 156,
         image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
         features: ['City View', 'Gym', 'WiFi', 'Concierge']
      },
      {
         id: '4',
         title: 'COUNTRY ESTATE',
         location: 'Austin, TX',
         price: 90,
         rating: 4.6,
         reviews: 73,
         image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
         features: ['Garden', 'Fireplace', 'WiFi', 'BBQ']
      }
   ];
   return (
      <div>Featured</div>
   )
}

export default Featured