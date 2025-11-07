import { useState } from 'react';
import { useMyBookings, useCancelBooking } from '@/hooks/bookings/useBookings';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Loader2, X } from 'lucide-react';
import PaymentButton from '@/components/PaymentButton';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const { data: bookings, isLoading } = useMyBookings();
  const { mutate: cancelBooking } = useCancelBooking();
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = (bookingId) => {
    setCancellingId(bookingId);
    cancelBooking(bookingId, {
      onSuccess: () => {
        toast.success('Your booking has been cancelled successfully');
        setCancellingId(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
        setCancellingId(null);
      },
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-200 text-yellow-700', label: 'Pending' },
      ACCEPTED: { color: 'bg-green-200 text-green-700', label: 'Accepted' },
      REJECTED: { color: 'bg-red-200 text-red-700', label: 'Rejected' },
      CANCELLED: { color: 'bg-gray-200 text-gray-700', label: 'Cancelled' },
      COMPLETED: { color: 'bg-blue-200 text-blue-700', label: 'Completed' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold ">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your room booking requests
          </p>
        </div>

        {!bookings || bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No bookings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Room Image */}
                    <div className="w-full md:w-48 h-48 flex-shrink-0">
                      <img
                        src={booking.room.images[0] || '/placeholder.svg'}
                        alt={booking.room.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold">
                            {booking.room.title}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="flex items-center text-gray-400 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{booking.room.address}</span>
                        </div>
                      </div>

                      {/* Dates */}
                      {(booking.checkInDate || booking.checkOutDate) && (
                        <div className="flex items-center gap-4 text-sm">
                          {booking.checkInDate && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                              <span>Check-in: {formatDate(booking.checkInDate)}</span>
                            </div>
                          )}
                          {booking.checkOutDate && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                              <span>Check-out: {formatDate(booking.checkOutDate)}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Message */}
                      {booking.message && (
                        <div>
                          <p className="text-sm text-neutral-500 border py-4 px-2 rounded">
                            <span className="font-medium">Your message: </span>
                            {booking.message}
                          </p>
                        </div>
                      )}

                      {/* Owner Response */}
                      {booking.responseMessage && (
                        <div>
                          <p className="text-sm text-neutral-500 border py-4 px-2 rounded">
                            <span className="font-medium">Owner's response: </span>
                            {booking.responseMessage}
                          </p>
                        </div>
                      )}
                      {/* Owner Info */}
                      <div className="text-sm text-gray-400">
                        <span className="font-medium">Owner: </span>
                        {booking.room.owner.name} ({booking.room.owner.email})
                      </div>

                      {/* Price */}
                      <div className="text-2xl font-bold text-orange-500">
                        Rs. {booking.room.price}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        {booking.status === 'ACCEPTED' && (
                          <div className="flex-1">
                            <PaymentButton bookingId={booking.id} />
                          </div>
                        )}
                        {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                          <Button
                            variant="outline"
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="border-red-500 text-red-500 hover:bg-red-50"
                          >
                            {cancellingId === booking.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
