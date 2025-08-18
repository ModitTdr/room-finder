import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import ReviewController from "../controller/reviewController.js";

const router = express.Router();

router.get('/:roomid', isLoggedIn, ReviewController.getReviews);
router.post('/:roomId', isLoggedIn, ReviewController.createReview);
router.delete('/:roomId', isLoggedIn, ReviewController.deleteReview);

router.put('/:roomId', isLoggedIn, ReviewController.updateReview);

export default router;