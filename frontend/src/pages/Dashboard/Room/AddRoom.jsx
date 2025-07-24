import { useState } from 'react';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

import { Check, Home, Image as ImageIcon, Lightbulb, X } from "lucide-react";

import UploadWidget from "@/components/UploadWidget";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { useCreateRoom } from "@/hooks/rooms/useRooms";
/* -------- shadcn components ------- */
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";


/* -------------- enums ------------- */
const RoomType = {
   SINGLE: "SINGLE",
   DOUBLE: "DOUBLE",
   FLAT: "FLAT",
   APARTMENT: "APARTMENT",
   HOSTEL: "HOSTEL"
}
const Amenities = [
   "wifi",
   "parking",
   "ac",
   "laundry",
   "furnished",
   "tv",
   "kitchen",
   "private_bathroom"
];


/* ------- validation schemas ------- */
const roomSchema = z.object({
   title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
   description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description must be less than 1000 characters"),
   address: z.string().max(500, 'Address must be less than 500 characters'),
   latitude: z.number().nullable(),
   longitude: z.number().nullable(),
   price: z.number()
      .int('Price must be an integer')
      .positive('Price must be positive')
      .min(100, "Price seems too low")
      .max(1000000, 'Price seems unrealistic'),
   roomType: z.enum([RoomType.SINGLE, RoomType.DOUBLE, RoomType.FLAT, RoomType.APARTMENT, RoomType.HOSTEL]),
   images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required"),
   amenities: z.array(z.string().min(1)).optional().nullable(),
});

/* ----------- components ----------- */
const AddRoom = () => {
   const queryClient = useQueryClient();

   const { mutate: createNewRoom } = useCreateRoom();

   /* - form default values and submit - */
   const form = useForm({
      resolver: zodResolver(roomSchema),
      defaultValues: {
         title: "",
         description: "",
         address: "",
         latitude: null,
         longitude: null,
         price: null,
         roomType: undefined,
         images: [],
         amenities: [],
      },
   });

   // Get images from form state for preview
   const watchedImages = form.watch("images");

   const handleImageUpload = (url) => {
      const currentImages = form.getValues("images") || [];
      const newImages = [...currentImages, url];
      form.setValue("images", newImages, { shouldValidate: true });
   };

   const handleImageRemove = (indexToRemove) => {
      const currentImages = form.getValues("images") || [];
      const newImages = currentImages.filter((_, index) => index !== indexToRemove);
      form.setValue("images", newImages, { shouldValidate: true });
   };

   const onSubmit = async (values) => {
      try {
         console.log("Submitting values:", values);
         createNewRoom(values);
         form.reset();
         toast.success("Room listed successfully!");
      } catch (error) {
         console.error("Error listing room:", error);
         toast.error("Failed to list room. Please try again.");
      }
   };

   return (
      <div className="py-8 container mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8 ">
         {/* --------- Topbar Section --------- */}
         <div className="text-center transition-all duration-700">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
               List Your Room
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
               Create a room listing that attracts the perfect tenants.
            </p>
         </div>

         {/* ------------ Main Body ----------- */}
         <h2 className="text-2xl font-semibold mb-6 text-foreground">Room Details</h2>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               {/* Basic Room Information */}
               <div className="gap-6 p-8 rounded-lg border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl space-y-8">
                  <div className="overflow-hidden space-y-1">
                     <div className="flex items-center gap-3 text-xl relative z-10">
                        <div className="p-2 bg-primary/10 rounded-lg">
                           <Home className="h-5 w-5 text-primary" />
                        </div>
                        Room Information
                     </div>
                     <p className='text-sm text-muted-foreground'>Tell us about your room and what makes it special</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Title */}
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Title *</FormLabel>
                              <FormControl>
                                 <Input placeholder="e.g., Cozy room near university" {...field} />
                              </FormControl>
                              <FormDescription>A catchy title for your room listing.</FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {/* Price */}
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Price (NPR) *</FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    placeholder="e.g., 15000"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                                 />
                              </FormControl>
                              <FormDescription>Monthly rent for the room.</FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {/* Room Type */}
                     <FormField
                        control={form.control}
                        name="roomType"
                        render={({ field }) => (
                           <FormItem >
                              <FormLabel>Room Type *</FormLabel>
                              <Select key={field.value} onValueChange={field.onChange} value={field.value || ""}>
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select Room Type" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {Object.values(RoomType).map((roomOption) => (
                                       <SelectItem key={roomOption} value={roomOption}>
                                          {roomOption.charAt(0).toUpperCase() + roomOption.slice(1).toLowerCase()}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              <FormDescription>Specify the type of room you're offering.</FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {/* Address */}
                     <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                           <FormItem className="relative">
                              <FormLabel>Address *</FormLabel>
                              <FormControl>
                                 <AddressAutocomplete
                                    value={field.value}
                                    onChange={field.onChange}
                                    onSelect={(item) => {
                                       form.setValue("latitude", item.lat);
                                       form.setValue("longitude", item.lng);
                                    }}
                                    placeholder="e.g., New Road, Kathmandu"
                                 />
                              </FormControl>
                              <FormDescription>The full address of the room.</FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
                  {/* Description */}
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Description *</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Describe your room, its features, and what makes it a great place to live."
                                 className="resize-y min-h-[100px]"
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription>Provide a detailed description of your room.</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               {/* Room Images */}
               <div className="gap-6 p-8 rounded-lg border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl space-y-8">
                  <div className="overflow-hidden space-y-1">
                     <div className="flex items-center gap-3 text-xl relative z-10">
                        <div className="p-2 bg-accent/10 rounded-lg">
                           <ImageIcon className="h-5 w-5 text-accent" />
                        </div>
                        Room Images
                     </div>
                     <p className='text-sm text-muted-foreground'>Upload clear photos of your room (living space, kitchen, bathroom, etc.).</p>
                  </div>
                  <FormField
                     control={form.control}
                     name="images"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <UploadWidget
                                 multiple={true}
                                 maxCount={5}
                                 onUpload={handleImageUpload}
                                 onUploadError={(error) => {
                                    toast.error("Image upload failed: " + error.message);
                                 }}
                              >
                                 <Button type="button" className="w-full">
                                    Upload Room Image
                                 </Button>
                              </UploadWidget>
                           </FormControl>
                           <FormDescription>
                              Upload high-quality images of your room. At least one image is required.
                           </FormDescription>
                           <FormMessage />
                           {watchedImages && watchedImages.length > 0 && (
                              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                 {watchedImages.map((src, index) => (
                                    <div key={index} className="relative w-full h-32 group">
                                       <img
                                          src={src}
                                          alt={`Room preview ${index + 1}`}
                                          className="w-full h-full object-cover rounded-md border border-gray-200"
                                       />
                                       <button
                                          type="button"
                                          onClick={() => handleImageRemove(index)}
                                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                       >
                                          <X size={12} />
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </FormItem>
                     )}
                  />
               </div>

               {/* Room Amenities */}
               <div className="gap-6 p-8 rounded-lg border-border/50 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl space-y-8">
                  <div className="overflow-hidden space-y-1">
                     <div className="flex items-center gap-3 text-xl relative z-10">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                           <Lightbulb className="h-5 w-5 text-blue-500" />
                        </div>
                        Amenities
                     </div>
                     <p className='text-sm text-muted-foreground'>Select the amenities available in your room or building.</p>
                  </div>
                  <FormField
                     control={form.control}
                     name="amenities"
                     render={() => (
                        <FormItem className="col-span-2">
                           <FormLabel>Available Amenities</FormLabel>
                           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {Amenities.map((amenity) => (
                                 <FormField
                                    key={amenity}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                       return (
                                          <FormItem key={amenity} className="flex flex-row items-start space-x-2 space-y-0">
                                             <FormControl>
                                                <Checkbox
                                                   checked={field.value?.includes(amenity)}
                                                   className="data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-all duration-200 cursor-pointer"
                                                   onCheckedChange={(checked) => {
                                                      if (checked) {
                                                         field.onChange([...field.value || [], amenity]);
                                                      } else {
                                                         field.onChange(field.value?.filter((val) => val !== amenity));
                                                      }
                                                   }}
                                                />
                                             </FormControl>
                                             <FormLabel className="text-sm font-medium cursor-pointer hover:text-accent transition-colors duration-200">
                                                {amenity.replace("_", " ").toUpperCase()}
                                             </FormLabel>
                                          </FormItem>
                                       );
                                    }}
                                 />
                              ))}
                           </div>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <button type='submit' className='fixed bottom-12 right-12 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 smooth-transition cursor-pointer'>
                  <Check size={28} color="black" />
               </button>
            </form>
         </Form>
      </div>
   );
};

export default AddRoom;