import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req); // ✅ use getAuth(req); no parentheses
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // find by clerkId (string), not Mongo _id
    let user = await User.findOne({ clerkId: userId });

    // lazily create a minimal user if missing (optional but handy)
    if (!user) {
      user = await User.create({ clerkId: userId });
    }

    req.user = user; // attach Mongoose user doc
    next();
  } catch (err) {
    console.error("protect middleware error:", err);
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};
