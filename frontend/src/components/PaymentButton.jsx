import { useInitiatePayment } from '@/hooks/payments/usePayments';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const PaymentButton = ({ bookingId, disabled = false }) => {
  const { mutate: initiatePayment, isLoading } = useInitiatePayment();

  const handlePayment = () => {
    if (!bookingId) {
      toast.error("Booking ID is required", {
        duration: 4000,
      });
      return;
    }

    initiatePayment(bookingId, {
      onSuccess: (response) => {
        const { data } = response;

        // Create form for eSewa payment
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.paymentUrl;

        const fields = {
          amount: data.amount,
          tax_amount: '0',
          total_amount: data.amount,
          transaction_uuid: data.transactionUuid,
          product_code: data.productCode,
          product_service_charge: '0',
          product_delivery_charge: '0',
          success_url: data.successUrl,
          failure_url: data.failureUrl,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
          signature: data.signature,
        };

        Object.keys(fields).forEach((key) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = fields[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Could not initiate payment", {
          duration: 4000,
        });
      },
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || disabled}
      className="w-full text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Pay with eSewa'
      )}
    </button>
  );
};

export default PaymentButton;
