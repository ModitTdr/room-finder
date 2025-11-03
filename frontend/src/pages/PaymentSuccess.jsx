import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(searchParams);

        const encodedData = params.get('data');

        if (!encodedData) {
          setStatus('error');
          setMessage('Invalid payment response from eSewa');
          return;
        }
        const decodedData = JSON.parse(atob(encodedData));

        const {
          transaction_code: transactionCode,
          status,
          total_amount: totalAmount,
          transaction_uuid: transactionUuid
        } = decodedData;

        if (!transactionUuid || !transactionCode) {
          setStatus('error');
          setMessage('Invalid payment response from eSewa');
          console.error('Missing transaction_uuid or transaction_code');
          return;
        }

        if (status !== 'COMPLETE') {
          setStatus('error');
          setMessage('Payment was not completed');
          console.error('Payment status is not COMPLETE:', status);
          return;
        }

        const response = await axios.get(
          `${API}/bookings/payment/verify?transaction_uuid=${transactionUuid}&transaction_code=${transactionCode}&total_amount=${totalAmount}&status=${status}`
        );

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);
          setTransactionId(response.data.transactionId);
        } else {
          setStatus('error');
          setMessage('Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Payment verification failed');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          {status === 'verifying' && (
            <div className="space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-orange-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">
                Verifying Payment...
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your payment with eSewa.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">
                Payment Successful!
              </h2>
              <p className="text-gray-500">{message}</p>
              {transactionId && (
                <div className="p-3 rounded text-sm bg-gray-100">
                  <span className="font-medium text-gray-900">Transaction ID: </span>
                  <span className="text-gray-700">{transactionId}</span>
                </div>
              )}
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
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold">
                Payment Failed
              </h2>
              <p className="text-gray-500">{message}</p>
              <div className="space-y-2 pt-4">
                <Button
                  onClick={() => navigate('/bookings')}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
