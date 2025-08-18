"use client"

import { useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MapPin,
    Star,
    Users,
    Calendar,
    Heart,
    EllipsisVertical,
    Edit2Icon,
    Trash,
} from "lucide-react"
import { useRoomWithService } from "@/hooks/rooms/useRooms"
import { useAuth } from "@/hooks/useAuth"
import { useCreateReview, useDeleteReview } from "../../../hooks/reviews/useReviews"

// Sample room data based on Prisma schema
const roomData = {
    id: "1",
    title: "Luxury Downtown Loft",
    description:
        "Experience the heart of the city in this stunning modern loft featuring floor-to-ceiling windows, exposed brick walls, and premium amenities. Perfect for business travelers and urban explorers seeking comfort and style in a prime location.",
    address: "123 Downtown Street, Metro City, MC 12345",
    price: 189,
    available: true,
    roomType: "DELUXE",
    images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
    ],
    amenities: ["Wi-Fi", "Air Conditioning", "Parking", "Kitchen", "TV", "Coffee Machine"],
    owner: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    reviews: {
        average: 4.8,
        count: 127,
        recent: [
            { name: "Mike Chen", rating: 5, comment: "Absolutely perfect location and amazing amenities!" },
            { name: "Emma Davis", rating: 5, comment: "Clean, modern, and exactly as described. Highly recommend!" },
            { name: "Alex Rodriguez", rating: 4, comment: "Great stay, would definitely book again." },
        ],
    },
    createdAt: new Date("2023-08-15"),
}


export default function RoomInfoPage() {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const { data: room, isLoading } = useRoomWithService(id);
    const { mutate: createReview } = useCreateReview();
    const { mutate: deleteReview } = useDeleteReview();

    const handleBookNow = () => {
        console.log("Book Now clicked for room:", roomData.title)
    }
    const formatDate = (date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return "Invalid date";

        return parsedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
            day: "numeric"
        });
    };

    if (isLoading) return <span>loading..</span>
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const roomId = room.id;
        createReview({ roomId, comment: e.target['comment-text'].value });
    }
    const handleReviewDelete = (e) => {
        e.preventDefault();
        const roomId = room.id;
        deleteReview({ roomId });
    }

    // const handleReviewEdit = (e) => {
    //     e.preventDefault();
    //     const roomId = room.id;
    //     createReview({ roomId, comment: e.target['comment-text'].value });
    // }
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <Carousel className="w-full h-[60vh] z-10 relative">
                            <CarouselContent className="h-[60vh] rounded-xl">
                                {room.images.map((imageUrl, index) => (
                                    <CarouselItem key={index}>
                                        <img
                                            src={imageUrl}
                                            alt={`Room image ${index + 1}`}
                                            className="w-full h-full object-cover smooth-transition rounded-xl"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer  border-neutral-100 text-neutral-800 backdrop-blur-sm shadow-lg" />
                            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer border-neutral-100 text-neutral-800 backdrop-blur-sm shadow-lg" />
                            <div className="absolute top-6 right-8 bg-black/60 p-2.5 rounded-full hover:scale-110 cursor-pointer smooth-transition">
                                <Heart />
                            </div>
                        </Carousel>

                        {/* Room Information */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bol mb-2">{room.title}</CardTitle>
                                        <div className="flex items-center text-muted-foreground mb-2">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span className="text-sm">{room.address}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className="bg-orange-100 text-accent hover:bg-orange-200">
                                                {room.roomType}
                                            </Badge>
                                            <Badge
                                                variant={room.available ? "default" : "destructive"}
                                                className={room.available ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                                            >
                                                {room.available ? "Available" : "Booked"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-accent">Rs. {room.price}</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed text-muted-foreground">{room.description}</p>
                            </CardContent>
                        </Card>


                        {/* Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    Reviews
                                    <div className="flex items-center">
                                        <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                                        <span className="ml-1 text-lg font-bold text-orange-500">{roomData.reviews.average}</span>
                                        <span className="ml-1 text-sm text-muted-foreground">({room.reviews.length} reviews)</span>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* --------- review section --------- */}
                                {isAuthenticated &&
                                    <form onSubmit={handleReviewSubmit} className="mb-8 relative">
                                        <textarea
                                            id="comment-text"
                                            rows="5"
                                            className="w-full p-4 pb-12 border rounded-xl focus:outline-none bg-muted"
                                            placeholder="Write a comment..."
                                            required
                                        ></textarea>
                                        <button
                                            type="submit"
                                            class="absolute right-4 bottom-4 bg-accent text-white font-bold py-1.5 px-5 shadow-md rounded-sm cursor-pointer hover:bg-orange-500 smooth-transition"
                                        >
                                            Post
                                        </button>
                                    </form>
                                }

                                {/* ---------- reviews list ---------- */}
                                <div className="space-y-4">
                                    {room.reviews.map((review, index) => (
                                        <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 relative">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-muted-foreground">{review.user.name}</span>
                                                <div className="flex items-center">
                                                    {review.rating?.length != 0 || review.rating?.length == null && [...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground/80 text-sm">{review.comment}</p>
                                            {

                                                review.userId === user?.id && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild className="absolute top-0 right-2">
                                                            <EllipsisVertical className="cursor-pointer" size="18" />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            {/* <DropdownMenuItem className="cursor-pointer" onClick={handleReviewEdit}>
                                                                Edit <DropdownMenuShortcut><Edit2Icon /></DropdownMenuShortcut>
                                                            </DropdownMenuItem> */}
                                                            <DropdownMenuItem className="cursor-pointer" onClick={handleReviewDelete}>
                                                                Delete <DropdownMenuShortcut><Trash /></DropdownMenuShortcut>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <Card className="">
                            <CardContent className="space-y-4">
                                <div className="text-start">
                                    <div className="text-3xl font-bold text-orange-500">Rs. {room.price}</div>
                                </div>
                                <p className="pb-2">Owner Name & contact</p>
                                <Button
                                    onClick={handleBookNow}
                                    disabled={!room.available}
                                    className="w-full bg-accent hover:bg-orange-500 text-white font-semibold py-3 cursor-pointer"
                                >
                                    {room.available ? "Book Now" : "Not Available"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Room Type</span>
                                    </div>
                                    <span className="text-sm font-medium">{room.roomType}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Listed</span>
                                    </div>
                                    <span className="text-sm font-medium">{formatDate(room.createdAt)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Star className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Rating</span>
                                    </div>
                                    <span className="text-sm font-medium">{roomData.reviews.average}/5</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Amenities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">Amenities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 xl:grid-cols-2 place-items-center gap-4">
                                    {room.amenities.map((amenity) => (
                                        <span key={amenity} className="text-muted-foreground border rounded w-42 text-center py-1.5 smooth-transition hover:border-accent/70 hover:-translate-y-1">
                                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
