// import User from "../models/User.js";
// import { Webhook } from "svix";

// const clerkWebhooks =async(req,res)=>{
//     try{
//         // Create a SVIX instance with clerk webhook secret.
//      const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)
//      const headers={
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp":req.headers["svix-timestamp"],
//       "svix-signature":req.headers["svix-signature"],
//      };
//     //  Verifying Headers
//     await whook.verify(JSON.stringify(req.body),headers)

//     // Getting data from request body
//     const {data, type}=req.body
   
// //Switch Cases for Differnt Events
// switch(type){
//     case "user.created":{
//          const userData={
//         _id:data.id,
//         email: data.email_addresses[0].email_address,
//         username: data.first_name + " " + data.last_name,
//         image: data.image_url,
// }
//         await User.create(userData);
//         break;
//     }
//     case "user.updated":{
//          const userData={
//         _id:data.id,
//         email: data.email_addresses[0].email_address,
//         username: data.first_name + " " + data.last_name,
//         image: data.image_url,
// }
//         await User.findByIdAndUpdate(data.id,userData);
//         break;
//     }
//     case "user.deleted":{
//         await User.findByIdAndDelete(data.id);
//          await Hotel.deleteMany({ owner: data.id }); 
//         break;
//     }
//     default:
//         break;
// }
// res.json({success:true,message:"Webhook received"})
//     }
//     catch(error){
//         console.log(error.message);
//         res.json({succes:false,message:error.message});
//     }
// }
// export default clerkWebhooks
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify the webhook signature
    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id, // ✅ matches protect middleware & schema
          email: data.email_addresses[0].email_address,
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
          recentSearchedCities: [],
          role: "user",
        };
        await User.create(userData);
        console.log(`✅ User created in DB with clerkId: ${data.id}`);
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
        };
        await User.findOneAndUpdate({ clerkId: data.id }, userData, {
          new: true,
        });
        console.log(`✅ User updated in DB with clerkId: ${data.id}`);
        break;
      }

      case "user.deleted": {
        await User.findOneAndDelete({ clerkId: data.id });
        await Hotel.deleteMany({ owner: data.id });
        console.log(`✅ User deleted in DB with clerkId: ${data.id}`);
        break;
      }

      default:
        console.log(`⚠️ Unhandled Clerk webhook event: ${type}`);
        break;
    }

    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;

