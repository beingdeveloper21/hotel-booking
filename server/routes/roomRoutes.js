import express from 'express';
import { requireAuth } from '@clerk/express';
import { protect } from "../middleware/authMiddleware.js";
import {
  createRoom,
  getOwnerRooms,
  toggleRoomAvailabilty,
  getRooms
} from "../controllers/roomController.js";
import upload from "../middleware/uploadMiddleware.js";

const roomRouter = express.Router();

roomRouter.post('/', requireAuth(), protect, upload.array("images", 4), createRoom);
roomRouter.get('/', getRooms);
roomRouter.get('/owner', requireAuth(), protect, getOwnerRooms);
roomRouter.post('/toggle-availability', requireAuth(), protect, toggleRoomAvailabilty);

export default roomRouter;
