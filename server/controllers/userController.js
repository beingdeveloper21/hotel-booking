import User from "../models/User.js";

// GET /api/user
export const getUserData = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    console.error("getUserData error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/user/store-recent-search
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ success: false, message: "City is required" });
    }

    const user = req.user;

    // Add city if not already present
    if (!user.recentSearchedCities.includes(city)) {
      user.recentSearchedCities.push(city);
      await user.save();
    }

    res.status(200).json({ success: true, message: "City added to recent searches" });
  } catch (error) {
    console.error("storeRecentSearchedCities error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
