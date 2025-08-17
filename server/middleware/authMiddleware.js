import User from "../models/User.js";

// Middleware to fetch user from MongoDB based on Clerk authentication
export const protect = async (req, res, next) => {
  try {
    // Clerk middleware (requireAuth) attaches req.auth
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Fetch user from MongoDB
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // attach DB user to request
    next();
  } catch (error) {
    console.error("protect middleware error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
