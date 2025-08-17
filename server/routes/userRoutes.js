import express from "express";
import { requireAuth } from "@clerk/express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../controllers/userController.js";

const userRouter = express.Router();

// GET /api/user - fetch logged-in user
userRouter.get("/", requireAuth(), protect, getUserData);

// POST /api/user/store-recent-search - add city to recent searches
userRouter.post("/store-recent-search", requireAuth(), protect, storeRecentSearchedCities);

export default userRouter;
