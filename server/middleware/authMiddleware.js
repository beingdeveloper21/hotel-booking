// import { clerkClient } from "@clerk/clerk-sdk-node";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   try {
//     const auth = req.auth();
//     const clerkId = auth?.userId;
//     if (!clerkId) {
//       return res.status(401).json({ success: false, message: "Not authenticated" });
//     }

//     // Fetch user from MongoDB
//     let user = await User.findOne({ clerkId });


//     if (!user) {
//       console.log("User not found in database, creating new user...");

//       try {
//         const clerkUser = await clerkClient.users.getUser(clerkId);

//         const userData = {
//           clerkId,
//           username: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || "User",
//           email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
//           image: clerkUser.imageUrl || "",
//           role: "user",
//           recentSearchedCities: []
//         };

//         user = await User.create(userData);
//         console.log("New user created:", user);
//       } catch (clerkError) {
//         console.error("Failed to fetch user from Clerk:", clerkError);
//         return res.status(404).json({ success: false, message: "User not found and could not be created" });
//       }
//     }

//     req.user = user; 
//     next();
//   } catch (error) {
//     console.error("protect middleware error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const auth = req.auth();
    const clerkId = auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // Fetch user from Clerk if not in DB
      const clerkUser = await clerkClient.users.getUser(clerkId);

      const userData = {
        clerkId,
        username: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "User",
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        image: clerkUser.imageUrl || "",
        // role defaults to "user"
        recentSearchedCities: [],
      };

      user = await User.create(userData);
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("protect middleware error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
