import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { TbCurrencyRupeeNepalese } from "react-icons/tb";
import { MapPin } from "lucide-react";
const RoomCards = ({ room }) => {
    const imageUrl = room?.images[0];
    return (
        <Link to={`/rooms/${room.id}`}>
            <div className="relative mx-auto w-full min-w-[350px] max-w-sm h-fit transform cursor-pointer overflow-hidden rounded-lg shadow-2xl border group smooth-transition hover:scale-101 py-3">
                <div className={`absolute inset-0 bg-cover bg-center `} style={{ backgroundImage: `url('${imageUrl}')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 from-15% via-gray-950/95 via-40% to-transparent smooth-transition opacity-95 group-hover:opacity-50"></div>
                </div>
                <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-8 md:pb-3 text-start">
                    {/* ------------ room type ----------- */}
                    <div className="absolute top-2 right-4 grow-1 rounded-md bg-orange-600 px-3 py-1 text-sm font-semibold tracking-wider uppercase">{room.roomType}</div>

                    {/* ------- room card container ------ */}
                    <div className="pt-35 flex flex-col h-full overflow-hidden">
                        {/* ------------ card title, location & description ----------- */}
                        <div>
                            <div className="space-y-1">
                                <h2 className="text-2xl leading-tight font-extrabold drop-shadow-lg md:text-2xl">{room.title}</h2>
                                <div className="flex gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <p className="text-sm line-clamp-1">{room.address}</p>
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-gray-300 h-15 line-clamp-3">{room.description}</p>
                        </div>
                        {/* --------- card badges -------- */}
                        {room.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
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
                        {/* ----------- card footer ---------- */}
                        <div className="mt-4 flex justify-between items-center gap-x-4">

                            <div className="flex items-baseline-last gap-0.5 text-lg font-semibold shrink-0 ">
                                <div className="flex items-center text-xl md:text-2xl text-orange-500">
                                    <TbCurrencyRupeeNepalese className="h-y w-4" />
                                    {room.price}
                                </div>
                                <span className="text-xs text-muted-foreground">/month</span>
                            </div>


                            <div>
                                <button className="w-full rounded-lg bg-orange-600 p-2 px-6 font-bold tracking-wider text-white uppercase shadow-xl transition-colors duration-300 hover:bg-orange-700 hover:shadow-2xl md:w-auto cursor-pointer">View</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default RoomCards