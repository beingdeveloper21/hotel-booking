import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, toggleRoomAvailabilty, getRooms } from "../controllers/roomController.js";
import upload from "../middleware/uploadMiddleware.js";


const roomRouter=express.Router();

roomRouter.post('/',upload.array("images",4),protect,createRoom)
roomRouter.get('/',getRooms)
roomRouter.get('/owner',protect,getOwnerRooms)
roomRouter.post('/toggle-availability',protect,toggleRoomAvailabilty)

export default roomRouter;