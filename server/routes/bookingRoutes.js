import express from "express";
import { requireAuth } from "@clerk/express";

import {
  checkAvailabilityAPI,
  createBooking,
  getHotelBookings,
  getUserBookings,
  stripePayment,
} from "../controllers/bookingController.js";
import { stripeWebhooks } from "../controllers/stripeWebhooks.js";
import { protect } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

// Stripe webhook (⚠️ must use raw body, no auth middleware here)
bookingRouter.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Regular booking routes
bookingRouter.post("/check-availability", checkAvailabilityAPI);
bookingRouter.post("/book", requireAuth(), protect, createBooking);
bookingRouter.get("/user", requireAuth(), protect, getUserBookings);
bookingRouter.get("/hotel", requireAuth(), protect, getHotelBookings);
bookingRouter.post("/stripe-payment", requireAuth(), protect, stripePayment);

export default bookingRouter;
