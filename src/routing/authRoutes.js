import express from "express";

import authController from "../controller/authController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post('/login', authController.userLogin);
router.post('/signup', authController.userSignup);
router.get("/check", isLoggedIn, authController.userStatus);
router.post("/logout", authController.userLogout);

export default router;