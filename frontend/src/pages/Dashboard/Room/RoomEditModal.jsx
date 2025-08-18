import { useState, useEffect } from "react"
import { X, Upload, Plus, Trash2 } from "lucide-react"
import { TbCurrencyRupeeNepalese } from "react-icons/tb"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useUpdateRoom } from "@/hooks/rooms/useRooms"

const roomTypes = [
    "SINGLE",
    "DOUBLE",
    "FLAT",
    "APARTMENT",
    "HOSTEL",
]

const commonAmenities = [
    "WiFi", "AC", "Parking", "Kitchen", "Laundry", "Balcony",
    "Furnished", "Security", "Water Supply", "Electricity Backup"
]

export default function RoomEditModal({ room, isOpen, onClose }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        address: "",
        roomType: "",
        amenities: [],
        images: []
    })

    const [newAmenity, setNewAmenity] = useState("")
    const { mutate: updateRoom, isPending } = useUpdateRoom()

    // Initialize form data when room changes
    useEffect(() => {
        if (room) {
            setFormData({
                title: room.title || "",
                description: room.description || "",
                price: room.price || "",
                address: room.address || "",
                roomType: room.roomType || "",
                amenities: room.amenities || [],
                images: room.images || []
            })
        }
    }, [room])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAddAmenity = (amenity) => {
        if (amenity && !formData.amenities.includes(amenity)) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenity]
            }))
        }
        setNewAmenity("")
    }

    const handleRemoveAmenity = (amenityToRemove) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        updateRoom({
            roomId: room.id,
            updatedData: {
                ...formData,
                price: parseFloat(formData.price)
            }
        }, {
            onSuccess: () => {
                onClose()
            }
        })
    }

    if (!room) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Edit Room Details
                        <Badge variant="outline" className="text-xs">
                            ID: {room.id}
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Room Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="Enter room title"
                            required
                        />
                    </div>

                    {/* Price and Room Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Monthly Rent *</Label>
                            <div className="relative">
                                <TbCurrencyRupeeNepalese className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange("price", e.target.value)}
                                    placeholder="0"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="roomType">Room Type *</Label>
                            <Select
                                value={formData.roomType}
                                onValueChange={(value) => handleInputChange("roomType", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select room type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roomTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Enter full address"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Describe your room..."
                            rows={3}
                        />
                    </div>

                    {/* Amenities */}
                    <div className="space-y-3">
                        <Label>Amenities</Label>

                        {/* Quick Add Common Amenities */}
                        <div className="flex flex-wrap gap-2">
                            {commonAmenities.map((amenity) => (
                                <Button
                                    key={amenity}
                                    type="button"
                                    variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        if (formData.amenities.includes(amenity)) {
                                            handleRemoveAmenity(amenity)
                                        } else {
                                            handleAddAmenity(amenity)
                                        }
                                    }}
                                    className="text-xs"
                                >
                                    {amenity}
                                </Button>
                            ))}
                        </div>

                        {/* Custom Amenity Input */}
                        <div className="flex gap-2">
                            <Input
                                value={newAmenity}
                                onChange={(e) => setNewAmenity(e.target.value)}
                                placeholder="Add custom amenity"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddAmenity(newAmenity)
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                onClick={() => handleAddAmenity(newAmenity)}
                                size="sm"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Selected Amenities */}
                        {formData.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.amenities.map((amenity, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        {amenity}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAmenity(amenity)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Images Section */}
                    <div className="space-y-3">
                        <Label>Room Images</Label>
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Room ${index + 1}`}
                                            className="w-full h-20 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: prev.images.filter((_, i) => i !== index)
                                                }))
                                            }}
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button type="button" variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Images
                        </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Updating..." : "Update Room"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}