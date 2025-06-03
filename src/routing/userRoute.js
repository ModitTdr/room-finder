import express from "express";
import userController, { getUserById } from "../controller/userController.js";

const router = express.Router();

router.get('/',userController.getAllUser);

router.post('/login', userController.userLogin);

router.post('/signup', userController.userSignup);

router.get('/:id',userController.getUserById);

router.delete('/:id', userController.deleteUser);

router.put('/:id', userController.updateUser);

export default router;