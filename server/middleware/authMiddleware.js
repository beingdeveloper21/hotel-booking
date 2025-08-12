// import User from "../models/User.js"

// //Middleware to check if user is authenticated

// export const protect = async(req,res,next)=>{
//     const {userId} = req.auth();
//     if(!userId){
//         res.json({success:false,message:"not authenticated"})
//     }
//     else{
//         const user= await User.findById(userId);
//         req.user=user;
//         next()
//     }
//   }
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   try {
//     // const { userId } = req.auth(); // no parentheses
//   console.log("DEBUG: req.auth =", req.auth); // <-- add this
// const { userId } = req.auth; // <-- remove the parentheses
// console.log("DEBUG: userId from Clerk =", userId);

//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Not authenticated" });
//     }

//     const user = await User.findOne({ clerkId: userId }); // match by clerkId
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found in DB" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
import User from "../models/User.js";
export const protect = async (req, res, next) => {
  try {
    const { userId, sessionClaims } = req.auth(); // <- function call, not property
    console.log("DEBUG: userId from Clerk =", userId);

    let user = await User.findById(userId);

    if (!user) {
      console.log("User not found in DB. Creating...");

      user = await User.create({
        _id: userId,
        username: sessionClaims?.username || "Guest",
        email: sessionClaims?.email || "unknown@example.com",
        image: sessionClaims?.image || "https://via.placeholder.com/150", // <-- give default if missing
        role: "user",
        recentSearchedCities: []
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};


