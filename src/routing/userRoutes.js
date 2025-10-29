import express from "express";

import userController from "../controller/userController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import authorize from "../middleware/roleMiddleware.js";
import userProfileController from "../controller/userProfileController.js";
const router = express.Router();

//User Controller
router.get(
    '/',
    isLoggedIn,
    authorize('ADMIN'),
    userController.getAllUser
);
router.patch(
    '/:id',
    isLoggedIn,
    authorize('ADMIN'),
    userController.updateUserByAdmin
);
router.get(
    '/me',
    isLoggedIn,
    userController.getUserById
);
router.delete(
    '/me',
    isLoggedIn,
    userController.deleteUser)
    ;
router.put(
    '/me',
    isLoggedIn,
    userController.updateUser
);
router.get(
    '/me/userprofile',
    isLoggedIn,
    userProfileController.getUserProfile
);
router.put(
    '/me/userprofile',
    isLoggedIn,
    userProfileController.createUserProfile
);

export default router;