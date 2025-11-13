import crypto from 'crypto';
import db from '../prismaClient.js';
import axios from 'axios';

const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_PAYMENT_URL = process.env.ESEWA_PAYMENT_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_VERIFY_URL = process.env.ESEWA_VERIFY_URL || 'https://rc-epay.esewa.com.np/api/epay/transaction/status/';

function generateSignature(message, secretKey) {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
}

export const initiateEsewaPayment = async (bookingId, userId) => {
  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
      userId
    },
    include: {
      room: true,
      user: true
    }
  });

  if (!booking) {
    throw new Error('Booking not found');
  }
  if (booking.status !== 'ACCEPTED') {
    throw new Error('Only accepted bookings can be paid');
  }

  const completedPayment = await db.payment.findFirst({
    where: {
      bookingId: booking.id,
      status: 'COMPLETED'
    }
  });
  if (completedPayment) {
    throw new Error('This booking has already been paid');
  }
  await db.payment.deleteMany({
    where: {
      bookingId: booking.id,
      status: {
        in: ['PENDING', 'FAILED']
      }
    }
  });
  const payment = await db.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.room.price,
      status: 'PENDING'
    }
  });

  const transactionUuid = payment.id;

  const totalAmount = booking.room.price.toString();
  const productCode = ESEWA_MERCHANT_ID;

  if (booking.room.price < 10) {
    throw new Error('Payment amount must be at least Rs. 10');
  }
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const signature = generateSignature(message, ESEWA_SECRET_KEY);

  return {
    paymentId: payment.id,
    amount: totalAmount,
    transactionUuid,
    productCode,
    signature,
    successUrl: `${process.env.FRONTEND_URL}/payment/success`,
    failureUrl: `${process.env.FRONTEND_URL}/payment/failure`,
    paymentUrl: ESEWA_PAYMENT_URL,
    bookingId: booking.id,
    productName: booking.room.title
  };
};

export const verifyEsewaPayment = async (paymentData) => {
  const { transaction_uuid, transaction_code } = paymentData;

  try {
    const payment = await db.payment.findUnique({
      where: { id: transaction_uuid },
      include: {
        booking: true
      }
    });
    if (!payment) {
      throw new Error('Payment record not found');
    }
    const verifyUrl = `${ESEWA_VERIFY_URL}?product_code=${ESEWA_MERCHANT_ID}&total_amount=${payment.amount}&transaction_uuid=${transaction_uuid}`;
    const response = await axios.get(verifyUrl);
    if (response.data.status === 'COMPLETE' && response.data.transaction_uuid === transaction_uuid) {
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          esewaTransactionId: transaction_code,
          paidAt: new Date()
        }
      });
      await db.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: 'COMPLETED'
        }
      });
      await db.room.update({
        where: { id: payment.booking.roomId },
        data: {
          available: false
        }
      });

      return {
        success: true,
        message: 'Payment verified successfully',
        transactionId: transaction_code,
        amount: payment.amount
      };
    } else {
      throw new Error('Payment verification failed');
    }
  } catch (error) {
    if (transaction_uuid) {
      await db.payment.updateMany({
        where: {
          id: transaction_uuid,
          status: 'PENDING'
        },
        data: {
          status: 'FAILED'
        }
      });
    }

    console.error('eSewa verification error:', error);
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};

export const getPaymentHistoryService = async (userId) => {
  const payments = await db.payment.findMany({
    where: {
      booking: {
        userId
      }
    },
    include: {
      booking: {
        include: {
          room: {
            select: {
              title: true,
              address: true,
              images: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return payments;
};

export default {
  initiateEsewaPayment,
  verifyEsewaPayment,
  getPaymentHistoryService
};
