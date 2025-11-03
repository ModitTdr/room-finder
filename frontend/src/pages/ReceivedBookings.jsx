import { useState } from 'react';
import { useReceivedBookings, useUpdateBookingStatus } from '@/hooks/bookings/useBookings';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Calendar, Loader2, Check, X, User, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReceivedBookings = () => {
  const { data: bookings, isLoading } = useReceivedBookings();
  const { mutate: updateStatus, isLoading: isUpdating } = useUpdateBookingStatus();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [actionType, setActionType] = useState(null); // 'ACCEPTED' or 'REJECTED'

  const handleAction = (booking, action) => {
    setSelectedBooking(booking);
    setActionType(action);
    setResponseMessage('');
  };

  const handleSubmit = () => {
    if (!selectedBooking || !actionType) return;

    updateStatus(
      {
        bookingId: selectedBooking.id,
        status: actionType,
        responseMessage: responseMessage || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Booking ${actionType.toLowerCase()}`, {
            description: `You have ${actionType.toLowerCase()} the booking request`,
          });
          setSelectedBooking(null);
          setResponseMessage('');
          setActionType(null);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to update booking");
        },
      }
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      ACCEPTED: { color: 'bg-green-100 text-green-800', label: 'Accepted' },
      REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Received Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage booking requests for your rooms
          </p>
        </div>

        {!bookings || bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No booking requests found</p>
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
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{booking.room.address}</span>
                        </div>
                      </div>

                      {/* Seeker Info */}
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-gray-900 mb-2">Seeker Information</h4>
                        <div className="flex items-center text-sm text-gray-700">
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{booking.user.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{booking.user.email}</span>
                        </div>
                        {booking.user.profile?.phone && (
                          <div className="flex items-center text-sm text-gray-700">
                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{booking.user.profile.phone}</span>
                          </div>
                        )}
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

                      {/* Seeker's Message */}
                      {booking.message && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Seeker's message: </span>
                            {booking.message}
                          </p>
                        </div>
                      )}

                      {/* Your Response */}
                      {booking.responseMessage && (
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Your response: </span>
                            {booking.responseMessage}
                          </p>
                        </div>
                      )}

                      {/* Price */}
                      <div className="text-2xl font-bold text-orange-500">
                        Rs. {booking.room.price}
                      </div>

                      {/* Actions */}
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => handleAction(booking, 'ACCEPTED')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleAction(booking, 'REJECTED')}
                            variant="outline"
                            className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {/* Booking Date */}
                      <div className="text-xs text-gray-500">
                        Requested on: {formatDate(booking.bookedAt)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Response Dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBooking(null);
            setResponseMessage('');
            setActionType(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'ACCEPTED' ? 'Accept Booking' : 'Reject Booking'}
            </DialogTitle>
            <DialogDescription>
              Add a message for the seeker (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={
                actionType === 'ACCEPTED'
                  ? 'e.g., Your booking is confirmed! Looking forward to having you.'
                  : 'e.g., Sorry, the room is not available for these dates.'
              }
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBooking(null);
                setResponseMessage('');
                setActionType(null);
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUpdating}
              className={
                actionType === 'ACCEPTED'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : actionType === 'ACCEPTED' ? (
                'Accept Booking'
              ) : (
                'Reject Booking'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceivedBookings;
