import express from "express";

import authController from "../controller/authController.js";

const router = express.Router();

router.post('/login', authController.userLogin);
router.post('/signup', authController.userSignup);

export default router;