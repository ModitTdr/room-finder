import express from "express";

import userController from "../controller/userController.js";
import verifyToken from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import permissionMiddleware from "../middleware/permissionMiddleware.js";
const router = express.Router();

//User Controller
router.get(
    '/',
    verifyToken,
    authorize('ADMIN'),
    userController.getAllUser
);
router.get(
    '/:id',
    verifyToken,
    permissionMiddleware, 
    userController.getUserById
);
router.delete(
    '/:id',
    verifyToken,
    permissionMiddleware, 
    userController.deleteUser)
;
router.put(
    '/:id',
    verifyToken,
    permissionMiddleware,
     userController.updateUser
);

export default router;