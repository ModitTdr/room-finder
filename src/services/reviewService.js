import db from "../prismaClient.js";

export const getReviewsByIdService = async (roomId) => {
   const reviews = await db.review.findMany({
      where: { roomId },
      include: {
         user: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: "desc" },
   })
   return reviews;
}

export const createReviewService = async (reviewData) => {
   const { roomId, userId, comment } = reviewData;
   const existingReview = await db.review.findFirst({
      where: {
         roomId,
         userId,
      },
   });
   if (existingReview) {
      throw new Error('Review already exists for this room by this user.');
   }
   const review = await db.review.create({
      data: {
         comment,
         userId,
         roomId,
      },
   });
   return review;
};

export const updateReviewService = async (reviewData) => {
   const { roomId, userId, comment } = reviewData;
   const review = await db.review.upsert({
      where: {
         userId_roomId: { userId, roomId },
      },
      update: { comment },
      create: {
         comment,
         rating: 0,
         userId,
         roomId,
      },
   });
   return review;
};

export const deleteReviewService = async (roomId, userId) => {
   const review = await db.review.delete({
      where: {
         userId_roomId: { userId, roomId },
      },
   });
   return review;
};