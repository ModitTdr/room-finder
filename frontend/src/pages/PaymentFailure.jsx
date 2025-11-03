import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">
              Payment Cancelled
            </h2>
            <p className="text-gray-500">
              Your payment was not completed. The booking request is still active.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg text-sm text-left">
              <p className="text-gray-700">
                <span className="font-medium">Note: </span>
                You can try the payment again from your bookings page once the owner accepts your request.
              </p>
            </div>
            <div className="space-y-2 pt-4">
              <Button
                onClick={() => navigate('/dashboard/bookings')}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                View My Bookings
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;
