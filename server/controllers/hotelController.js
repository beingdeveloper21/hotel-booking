import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// API: Register a new hotel
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

        // Update user role using clerkId
        await User.findOneAndUpdate(
            { clerkId: ownerClerkId },
            { role: "hotelOwner" }
        );

        res.json({ success: true, message: "Hotel Registered Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API: Get all hotels
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find()
            .populate({
                path: "owner",
                localField: "owner",
                foreignField: "clerkId",
                justOne: true,
                select: "username email image role",
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, hotels });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API: Get a hotel by ID
export const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
            .populate({
                path: "owner",
                localField: "owner",
                foreignField: "clerkId",
                justOne: true,
                select: "username email image role",
            });

        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        res.json({ success: true, hotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API: Get hotels for a specific owner
export const getOwnerHotels = async (req, res) => {
    try {
        const ownerClerkId = req.user.id;
        const hotels = await Hotel.find({ owner: ownerClerkId })
            .populate({
                path: "owner",
                localField: "owner",
                foreignField: "clerkId",
                justOne: true,
                select: "username email image role",
            });

        res.json({ success: true, hotels });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API: Update hotel details
export const updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const updateData = req.body;

        const hotel = await Hotel.findByIdAndUpdate(hotelId, updateData, { new: true })
            .populate({
                path: "owner",
                localField: "owner",
                foreignField: "clerkId",
                justOne: true,
                select: "username email image role",
            });

        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }

        res.json({ success: true, message: "Hotel updated successfully", hotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
