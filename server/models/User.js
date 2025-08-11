import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // ✅ stores Clerk ID
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
    recentSearchedCities: { type: [String], default: [] }, // ✅ spelling fixed
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
