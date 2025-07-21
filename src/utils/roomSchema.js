import { z } from "zod";

const RoomType = z.enum(["SINGLE", "DOUBLE", "FLAT", "APARTMENT", "HOSTEL"], {
   required_error: "Room type is required"
});

export const roomSchema = z.object({
   title: z
      .string({ required_error: "Title is required" })
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title is too long"),

   description: z
      .string({ required_error: "Description is required" })
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description is too long"),

   address: z
      .string({ required_error: "Address is required" })
      .min(5, "Address must be at least 5 characters")
      .max(300, "Address is too long"),

   latitude: z
      .number({ required_error: "Latitude is required" })
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),

   longitude: z
      .number({ required_error: "Longitude is required" })
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),

   price: z
      .number({ required_error: "Price is required" })
      .int("Price must be an integer")
      .positive("Price must be positive")
      .max(1000000, "Price seems unrealistic"),

   available: z.boolean().optional(),

   roomType: RoomType,

   images: z
      .array(z.string().url("Each image must be a valid URL"), {
         required_error: "Images are required"
      })
      .min(1, "At least one image is required"),

   amenities: z
      .array(z.string().min(1))
      .optional()
      .nullable(),
});