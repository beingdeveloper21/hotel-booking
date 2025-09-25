// controllers/bookingController.js
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../configs/nodemailer.js";
import Stripe from "stripe";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Utility: check room availability
export const checkAvailability = async ({ room, checkInDate, checkOutDate }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        return bookings.length === 0;
    } catch (error) {
        console.error("Availability check error:", error);
        throw new Error("Error checking availability");
    }
};

// API: Check availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API: Create booking
export const createBooking = async (req, res) => {
    try {
        // ensure req.user exists
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        // Check availability
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available" });
        }

        // Fetch room + hotel data
        const roomData = await Room.findById(room).populate("hotel");
        if (!roomData || !roomData.hotel) {
            return res.status(404).json({ success: false, message: "Room or hotel not found" });
        }

        // Calculate price
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
        const totalPrice = roomData.pricePerNight * nights;

        // Create booking
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        // Send confirmation email (wrapped in try/catch to avoid crashing on failure)
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: req.user.email || "test@example.com",
                subject: "Hotel Booking Details",
                html: `
                    <h2>Your Booking Details</h2>
                    <p>Dear ${req.user.username || "Guest"},</p>
                    <p>Thank you for your booking! Here are your details:</p>
                    <ul>
                        <li><strong>Booking ID:</strong> ${booking._id}</li>
                        <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                        <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                        <li><strong>Check-In:</strong> ${booking.checkInDate.toDateString()}</li>
                        <li><strong>Check-Out:</strong> ${booking.checkOutDate.toDateString()}</li>
                        <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "$"} ${booking.totalPrice}</li>
                    </ul>
                `,
            };
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error("Email sending failed:", mailError);
        }

        res.json({ success: true, message: "Booking created successfully", booking });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API: Get all bookings for a user
export const getUserBookings = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const user = req.user._id;
        const bookings = await Booking.find({ user })
            .populate("room hotel")
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

// API: Get all bookings for a hotel owner
export const getHotelBookings = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (!hotel) {
            return res.json({ success: false, message: "No hotel found" });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate("room hotel user") // ✅ simpler populate
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

// API: Stripe Payment
export const stripePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const roomData = await Room.findById(booking.room).populate("hotel");
        if (!roomData || !roomData.hotel) {
            return res.status(404).json({ success: false, message: "Room or hotel not found" });
        }

        const origin = req.headers.origin || process.env.CLIENT_URL;

        const session = await stripeInstance.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: roomData.hotel.name },
                        unit_amount: booking.totalPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/loader/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata: { bookingId },
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe payment error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
