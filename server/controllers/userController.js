import User from "../models/User.js";

// GET /api/user
export const getUserData = async (req, res) => {
    try {
        // Fetch user from DB using clerkId
        const dbUser = await User.findOne({ clerkId: req.user.id });
        if (!dbUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: dbUser });
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

        // Fetch user from DB using clerkId
        const dbUser = await User.findOne({ clerkId: req.user.id });
        if (!dbUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add city if not already present
        if (!dbUser.recentSearchedCities.includes(city)) {
            dbUser.recentSearchedCities.push(city);
            await dbUser.save();
        }

        res.status(200).json({ success: true, message: "City added to recent searches" });
    } catch (error) {
        console.error("storeRecentSearchedCities error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
