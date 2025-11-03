import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBooking } from "@/hooks/bookings/useBookings";
import { toast } from 'react-hot-toast';

const BookingDialog = ({ roomId, roomTitle, roomPrice, children }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    message: '',
  });

  const { mutate: createBooking, isLoading } = useCreateBooking();

  const handleSubmit = (e) => {
    e.preventDefault();

    createBooking(
      {
        roomId,
        checkInDate: formData.checkInDate || null,
        checkOutDate: formData.checkOutDate || null,
        message: formData.message,
      },
      {
        onSuccess: (data) => {
          toast.success("Booking Request Sent! The owner will review your request shortly.");
          setOpen(false);
          setFormData({
            checkInDate: '',
            checkOutDate: '',
            message: '',
          });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Room</DialogTitle>
          <DialogDescription>
            Send a booking request for {roomTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Price
              </Label>
              <div className="text-2xl font-bold text-orange-500">
                Rs. {roomPrice}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInDate" className="text-sm font-medium">
                  Check-in Date (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="checkInDate"
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) =>
                      setFormData({ ...formData, checkInDate: e.target.value })
                    }
                    className="pl-3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutDate" className="text-sm font-medium">
                  Check-out Date (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="checkOutDate"
                    type="date"
                    value={formData.checkOutDate}
                    onChange={(e) =>
                      setFormData({ ...formData, checkOutDate: e.target.value })
                    }
                    min={formData.checkInDate}
                    className="pl-3"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Message to Owner
              </Label>
              <Textarea
                id="message"
                placeholder="Tell the owner about yourself and why you're interested..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
