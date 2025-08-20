import { requireAuth } from "@clerk/express";
import express from "express";
import { createUserIfMissing, getUserData, storeRecentSearchedCities } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// GET /api/user - fetch logged-in user
userRouter.get("/", requireAuth(), protect, getUserData);

// POST /api/user/store-recent-search - add city to recent searches
userRouter.post("/store-recent-search", requireAuth(), protect, storeRecentSearchedCities);

userRouter.post("/create-if-missing", requireAuth(), createUserIfMissing);


export default userRouter;
