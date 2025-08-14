import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Clerk user id (e.g., "user_30xeUrkXU9s8vzTVKVA8cVsEtgg")
    clerkId: { type: String, required: true, unique: true },

    // keep these optional to avoid insertion failures if webhook fields are missing
    username: { type: String, default: "" },
    email: { type: String, default: "" },
    image: { type: String, default: "" },

    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },

    // start empty; don't mark 'required' inside arrays or inserts will fail
    recentSearchedCities: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
