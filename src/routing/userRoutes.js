import express from "express";

import userController from "../controller/userController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import authorize from "../middleware/roleMiddleware.js";
import permissionMiddleware from "../middleware/permissionMiddleware.js";
const router = express.Router();

//User Controller
router.get(
    '/',
    isLoggedIn,
    authorize('ADMIN'),
    userController.getAllUser
);
router.get(
    '/:id',
    isLoggedIn,
    permissionMiddleware, 
    userController.getUserById
);
router.delete(
    '/:id',
    isLoggedIn,
    permissionMiddleware, 
    userController.deleteUser)
;
router.put(
    '/:id',
    isLoggedIn,
    permissionMiddleware,
    userController.updateUser
);

export default router;