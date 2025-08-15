import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const ownerClerkId = req.user.id; // Clerk string ID

    // Check if user already registered a hotel
    const existingHotel = await Hotel.findOne({ name, owner: ownerClerkId });
    if (existingHotel) {
      return res.json({ success: false, message: "Hotel already registered" });
    }

    // Create hotel with Clerk ID as owner
    await Hotel.create({ name, address, contact, city, owner: ownerClerkId });

    // Update user role using clerkId instead of _id
    await User.findOneAndUpdate(
      { clerkId: ownerClerkId },
      { role: "hotelOwner" }
    );

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
