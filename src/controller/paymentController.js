import {
  initiateEsewaPayment,
  verifyEsewaPayment,
  getPaymentHistoryService
} from '../services/esewaService.js';

export const initiatePayment = async (req, res) => {
  const { bookingId } = req.body;
  const userId = req.user.id;

  if (!bookingId) {
    return res.status(400).json({ message: "Booking ID is required" });
  }

  try {
    const paymentData = await initiateEsewaPayment(bookingId, userId);

    res.status(200).json({
      message: "Payment initiated",
      data: paymentData
    });
  } catch (error) {
    console.error("Initiate payment error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { transaction_uuid, transaction_code, total_amount, status } = req.query;

  if (!transaction_uuid || !transaction_code) {
    console.log('Missing required parameters');
    return res.status(400).json({ message: "Missing required payment parameters" });
  }

  // Check if eSewa marked it as complete
  if (status !== 'COMPLETE') {
    console.log('Payment status not COMPLETE:', status);
    return res.status(400).json({ message: "Payment was not completed" });
  }

  try {
    const result = await verifyEsewaPayment({
      transaction_uuid,
      transaction_code,
      total_amount
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await getPaymentHistoryService(req.user.id);

    res.status(200).json(payments);
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({ message: "Error fetching payment history" });
  }
};

export default {
  initiatePayment,
  verifyPayment,
  getPaymentHistory
};
