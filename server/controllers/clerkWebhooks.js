import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    
    const payloadString =
      typeof req.body === "string"
        ? req.body
        : req.body?.toString?.() ?? JSON.stringify(req.body);


    wh.verify(payloadString, headers);

    const evt = JSON.parse(payloadString);
    const { data, type } = evt;


    const clerkId = data.id; 

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId, // Store Clerk's ID here
          email:
            data?.email_addresses?.[0]?.email_address ?? "",
          username:
            [data?.first_name, data?.last_name]
              .filter(Boolean)
              .join(" ") || data?.username || "",
          image: data?.image_url ?? "",
        };


        const user = await User.findOneAndUpdate(
          { clerkId },
          { $set: userData, $setOnInsert: { recentSearchedCities: [] } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        break;
      }

      case "user.updated": {
        const userData = {
          email:
            data?.email_addresses?.[0]?.email_address ?? "",
          username:
            [data?.first_name, data?.last_name]
              .filter(Boolean)
              .join(" ") || data?.username || "",
          image: data?.image_url ?? "",
        };
        await User.findOneAndUpdate({ clerkId }, { $set: userData });
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId });
        // await Hotel.deleteMany({ ownerClerkId: clerkId });
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
