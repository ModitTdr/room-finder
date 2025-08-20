import { getReviewsByIdService, createReviewService, updateReviewService, deleteReviewService } from '../services/reviewService.js'
import axios from "axios";

const getReviews = async (req, res) => {
   try {
      const reviews = await getReviewsByIdService(req.params.roomid);
      if (reviews.length == 0) return res.status(404).json({ message: "No Reviews Available" });
      res.status(200).json(reviews);
   } catch (error) {
      res.status(500).json({ message: "Error fetching room" });
   }
}

const createReview = async (req, res) => {
   const { comment } = req.body;
   const { roomId } = req.params;
   const userId = req.user.id;

   if (!roomId || !comment) {
      return res.status(400).json({ message: "Review required" });
   }

   try {
      const response = await axios.post("http://127.0.0.1:5000/predict", { text: comment });
      const { rating } = response.data;
      const review = await createReviewService({ roomId, userId, comment, rating });
      if (!review) {
         return res.status(400).json({ message: "Failed to create review" });
      }
      res.status(201).json(review);
   } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "You can review only once" });
   }
}

const deleteReview = async (req, res) => {
   const { roomId } = req.params;
   const userId = req.user.id;
   try {
      const review = await deleteReviewService(roomId, userId);
      if (!review) {
         return res.status(404).json({ message: "Review not found" });
      }
      res.status(200).json({ message: "Review deleted successfully", review });
   } catch (error) {
      console.error("Create review error:", error);
      if (error.message.includes("Review already exists")) {
         return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error creating review" });
   }
}

const updateReview = async (req, res) => {
   const { roomId, comment } = req.body;
   const userId = req.user.id;

   if (!roomId || !comment) {
      return res.status(400).json({ message: "Room ID and comment are required" });
   }

   try {
      const review = await updateReviewService({ roomId, userId, comment });
      if (!review) {
         return res.status(400).json({ message: "Failed to create review" });
      }
      res.status(201).json(review);
   } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "You can review only once" });
   }
}

export default {
   getReviews,
   createReview,
   updateReview,
   deleteReview
}
