import User from "../models/User.js";
import { Webhook } from "svix";
// import Hotel from "../models/Hotel.js"; // uncomment if you have a Hotel model

const clerkWebhooks = async (req, res) => {
    try {
        console.log("📩 Incoming Clerk Webhook:", req.body);

        // Create SVIX instance
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // Verify Headers
        await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;

        console.log(`🔔 Clerk event received: ${type} for userId = ${data.id}`);

        const userData = {
            _id: data.id, // Use Clerk's ID directly as Mongo _id
            email: data.email_addresses?.[0]?.email_address || "",
            username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            image: data.image_url || "",
            role: "user",
            recentSearchedCities: [],
        };

        switch (type) {
            case "user.created": {
                console.log("🆕 Creating new user:", userData);
                await User.findByIdAndUpdate(userData._id, userData, { upsert: true });
                break;
            }
            case "user.updated": {
                console.log("✏️ Updating user:", userData);
                await User.findByIdAndUpdate(userData._id, userData);
                break;
            }
            case "user.deleted": {
                console.log("🗑 Deleting user with ID:", data.id);
                await User.findByIdAndDelete(data.id);
                // await Hotel.deleteMany({ owner: data.id }); // if Hotel model exists
                break;
            }
            default:
                console.log("ℹ️ Unknown event type:", type);
                break;
        }

        res.json({ success: true, message: "Webhook processed" });
    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default clerkWebhooks;


