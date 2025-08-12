import express from "express";
import isLoggedIn from "../middleware/isLoggedIn.js";
import ReviewController from "../controller/reviewController.js";

const router = express.Router();

router.get('/:roomid', isLoggedIn, ReviewController.getReviews);
router.post('/', isLoggedIn, ReviewController.createReview);

export default router;