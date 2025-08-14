import { Webhook } from "svix";
import User from "../models/User.js";
// import Hotel from "../models/Hotel.js"; // uncomment if you actually have this model

const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // if this route uses express.raw, req.body is a Buffer
    const payloadString =
      typeof req.body === "string" ? req.body : req.body?.toString?.() ?? JSON.stringify(req.body);

    // Verify signature
    wh.verify(payloadString, headers);

    const evt = JSON.parse(payloadString);
    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data?.email_addresses?.[0]?.email_address ?? "",
          username: [data?.first_name, data?.last_name].filter(Boolean).join(" ") || data?.username || "",
          image: data?.image_url ?? "",
        };
        await User.findOneAndUpdate(
          { clerkId: data.id },
          { $set: userData, $setOnInsert: { recentSearchedCities: [] } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        break;
      }

      case "user.updated": {
        const userData = {
          email: data?.email_addresses?.[0]?.email_address ?? "",
          username: [data?.first_name, data?.last_name].filter(Boolean).join(" ") || data?.username || "",
          image: data?.image_url ?? "",
        };
        await User.findOneAndUpdate({ clerkId: data.id }, { $set: userData });
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: data.id });
        // If you really want to clean up hotels owned by this user, ensure you store owner as clerkId:
        // await Hotel.deleteMany({ ownerClerkId: data.id });
        break;
      }

      default:
        break;
    }

    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
