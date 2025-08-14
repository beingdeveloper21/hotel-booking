import User from "../models/User.js";

// GET /api/user
export const getUserData = async (req, res) => {
  try {
    // return only what the frontend needs
    const { role, recentSearchedCities, username, email, image, clerkId, _id } = req.user;
    res.json({
      success: true,
      role,
      recentSearchedCities,
      user: { username, email, image, clerkId, mongoId: _id }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/user/store-recent-search
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { city } = req.body;
    if (!city || typeof city !== "string") {
      return res.status(400).json({ success: false, message: "City is required" });
    }

    const user = req.user;
    if (!Array.isArray(user.recentSearchedCities)) {
      user.recentSearchedCities = [];
    }

    // de-dupe (case-insensitive) and keep last 3
    const normalized = city.trim();
    const exists = user.recentSearchedCities.some(
      c => String(c).toLowerCase() === normalized.toLowerCase()
    );

    if (!exists) {
      user.recentSearchedCities.push(normalized);
      // cap at 3 (remove oldest if > 3)
      if (user.recentSearchedCities.length > 3) {
        user.recentSearchedCities = user.recentSearchedCities.slice(-3);
      }
      await user.save();
    }

    res.status(200).json({ success: true, message: "City added to recent searches", recentSearchedCities: user.recentSearchedCities });
  } catch (error) {
    console.error("Error storing recent search:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
