// controllers/userController.js
// GET /api/user
export const getUserData = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/user/store-recent-search
export const storeRecentSearchedCities = async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const user = req.user;
    if (!user.recentSearchedCities.includes(city)) {
      user.recentSearchedCities.push(city);
      await user.save();
    }

    res.status(200).json({ message: "City added to recent searches" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
