import RoomListCards from "./RoomListCards"
import { useMyRooms } from "@/hooks/rooms/useRooms"
import { Input } from "@/components/ui/input"
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

const RoomList = () => {
   const { data: myrooms } = useMyRooms();
   const [search, setSearch] = useState("");
   const [roomTypeFilter, setRoomTypeFilter] = useState("All");
   const [sortOrder, setSortOrder] = useState("none");


   const handleChange = (e) => {
      setSearch(e.target.value);
   }
   const filteredRooms = myrooms
      ?.filter((room) => {
         const matchesSearch =
            room.title?.toLowerCase().includes(search.toLowerCase()) ||
            room.address?.toLowerCase().includes(search.toLowerCase()) ||
            room.roomType?.toLowerCase().includes(search.toLowerCase());

         const matchesRoomType =
            roomTypeFilter === "All" || room.roomType === roomTypeFilter;

         return matchesSearch && matchesRoomType;
      })
      ?.sort((a, b) => {
         if (sortOrder === "asc") return a.price - b.price;
         if (sortOrder === "desc") return b.price - a.price;
         return 0;
      });
   return (
      <div className="container mx-auto p-8 space-y-6">
         {/* ------------- header ------------- */}
         <div className="">
            <h1 className="text-3xl font-bold text-foreground">
               My Rooms
            </h1>
            <p className="text-muted-foreground">
               Manage your property listings
            </p>
         </div>
         {/* ------------- search & filters ------------- */}
         <div className="flex gap-4 items-start">
            <Input
               placeholder="Search your rooms"
               className="placeholder:italic border-input"
               onChange={handleChange}
            />
            {/* filter */}
            <div className="relative w-[180px] group">
               {/* Floating label */}
               <label
                  htmlFor="room-type-select"
                  className="absolute -top-3 left-4 px-1 text-xs bg-background pointer-events-none rounded"
               >
                  Room Type
               </label>

               {/* Your Select */}
               <Select onValueChange={(val) => setRoomTypeFilter(val)}>
                  <SelectTrigger className="w-full bg-blue-200 ring-0 focus-visible:ring-0 focus:outline-0">
                     <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="DOUBLE">Double</SelectItem>
                        <SelectItem value="FLAT">Flat</SelectItem>
                        <SelectItem value="APARTMENT">Apartment</SelectItem>
                        <SelectItem value="HOSTEL">Hostel</SelectItem>
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>
            {/* sort */}
            <div className="relative w-[180px] group">
               {/* Floating label */}
               <label
                  htmlFor="room-type-select"
                  className="absolute -top-3 left-4 px-1 text-xs bg-background pointer-events-none rounded"
               >
                  Sort
               </label>

               {/* Your Select */}
               <Select onValueChange={(val) => setSortOrder(val)}>
                  <SelectTrigger className="w-full bg-blue-200 ring-0 focus-visible:ring-0 focus:outline-0">
                     <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="asc">Price: Low to High</SelectItem>
                        <SelectItem value="desc">Price: High to Low</SelectItem>
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>
         </div>

         {/* ----------- room cards ----------- */}
         <div
            id="cards-wrapper"
            className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full mx-auto"
         >
            {filteredRooms && filteredRooms.length > 0 ? (
               filteredRooms.map((room) => (
                  <RoomListCards key={room.id} room={room} />
               ))
            ) : (
               <p>No rooms available.</p>
            )}
         </div>
      </div>
   )
}

export default RoomList