import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attaches MongoDB user object
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
