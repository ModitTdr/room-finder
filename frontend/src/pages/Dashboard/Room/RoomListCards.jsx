import { useState } from "react"
import { MapPin, Edit, Trash2, Eye } from "lucide-react"
import { TbCurrencyRupeeNepalese } from "react-icons/tb";

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel"

import RoomEditModal from "./RoomEditModal"
import { useDeleteRoom, useUpdateRoom } from "@/hooks/rooms/useRooms"

export default function RoomListCards({ room, onToggleAvailability }) {
   const [isAvailable, setIsAvailable] = useState(room.available);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false)

   const { mutate: delroom } = useDeleteRoom();
   const { mutate: updateRoom } = useUpdateRoom();

   const handleAvailabilityToggle = (checked) => {
      setIsAvailable(checked)
      updateRoom({
         roomId: room.id,
         updatedData: { available: checked }
      }, {
         onError: () => {
            setIsAvailable(!checked);
         }
      });
   }

   const handleEditClick = () => {
      setIsEditModalOpen(true)
   }
   const handleCloseEditModal = () => {
      setIsEditModalOpen(false)
   }

   const roomImage = room.images[0] || `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&crop=center`

   return (
      <>
         <Card className=
            "group relative overflow-hidden smooth-transition border-border/30 hover:border-primary/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-0 max-w-sm"
         >
            {/* Room Image */}
            <div className="relative h-50 overflow-hidden">
               {
                  room.images && room.images.length > 0 ? (
                     <Carousel className="w-full h-full z-10">
                        <CarouselContent>
                           {room.images.map((imageUrl, index) => (
                              <CarouselItem key={index}>
                                 <img
                                    src={imageUrl}
                                    alt={`Room image ${index + 1}`}
                                    className="w-full h-56 object-cover smooth-transition hover:scale-102"
                                 />
                              </CarouselItem>
                           ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer disabled:hidden" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer disabled:hidden" />
                     </Carousel>
                  ) : (
                     <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                        No Image Available
                     </div>
                  )
               }
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent smooth-transition group-hover:opacity-80" />

               {/* Availability Badge */}
               <div className={`absolute top-4 right-4 rounded-md px-2 text-sm font-medium border z-10 ${isAvailable
                  ? "bg-green-400/50 border-green-400/70 text-green-200/90 backdrop-blur-xl"
                  : "bg-red-500/80 text-red-200 border-red-00"
                  }`}>

                  {isAvailable ? "Available" : "Unavailable"}

               </div>

               {/* Room Type Badge */}
               <div className="absolute z-10 top-4 left-4 grow-1 rounded-md bg-orange-600 px-3 text-sm font-semibold tracking-wider uppercase">
                  {room.roomType}
               </div>

            </div>

            {/* Card Content */}
            <div className="p-6 pt-0 space-y-4">
               {/* Title and Price */}
               <div className="space-y-1">
                  <h3 className="font-bold text-2xl text-foreground line-clamp-2">
                     {room.title}
                  </h3>
                  <div className="flex items-baseline-last gap-0.5 text-lg font-semibold shrink-0 ">
                     <div className="flex items-center">
                        <TbCurrencyRupeeNepalese className="h-y w-4" />
                        {room.price}
                     </div>
                     <span className="text-xs text-muted-foreground">/month</span>
                  </div>
               </div>

               {/* Address */}
               <div className="flex gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <p className="text-sm line-clamp-1">{room.address}</p>
               </div>

               {/* Description */}
               <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description}
               </p>

               {/* Amenities */}
               {room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                     {room.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge
                           key={index}
                           variant="outline"
                           className="text-xs bg-muted/20 border-border"
                        >
                           {amenity}
                        </Badge>
                     ))}
                     {room.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-muted/20 border-border">
                           +{room.amenities.length - 3} more
                        </Badge>
                     )}
                  </div>
               )}

               {/* Actions */}
               <div className="flex items-center justify-between pt-4 border-t border-border/20">

                  {/* Availability Toggle */}
                  <div className="flex items-center gap-3 ">
                     <label htmlFor={`available-${room.id}`} className="text-sm font-medium text-foregroun cursor-pointer">
                        Available
                     </label>
                     <Switch
                        id={`available-${room.id}`}
                        checked={isAvailable}
                        onCheckedChange={handleAvailabilityToggle}
                        className="data-[state=checked]:bg-accent cursor-pointer"
                     />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                     {/* Quick View Button */}
                     <Button
                        size="sm"
                        className="text-foreground hover:text-foreground hover:bg-neutral-500/30 cursor-pointer bg-transparent"
                        onClick={() => onView(room.id)}
                     >
                        <Eye className="h-4 w-4 cursor-pointer" />
                     </Button>
                     <Button
                        size="sm"
                        onClick={handleEditClick}
                        className="text-foreground hover:text-foreground hover:bg-green-500/30 cursor-pointer bg-transparent"
                     >
                        <Edit className="h-4 w-4" />
                     </Button>
                     <Button
                        size="sm"
                        onClick={() => delroom(room.id)}
                        className="text-destructive hover:text-desnpm ructive hover:bg-destructive/30 cursor-pointer bg-transparent"
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </div>
         </Card >

         <RoomEditModal
            room={room}
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
         />
      </>
   )
}