import express from "express";
const router = express.Router();
import { getNearbyRooms } from '../controller/recommendationController.js';

router.get('/:id', getNearbyRooms);

export default router;