import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log("✅ Database connected")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
  } catch (error) {
    console.log("❌ Database connection error:", error.message);
  }
};

const fixUsers = async () => {
  await connectDB();

  try {
    
    const usersWithoutClerkId = await User.find({ clerkId: { $in: [null, undefined, ""] } });

    console.log(`Found ${usersWithoutClerkId.length} users with missing clerkId`);

    for (const user of usersWithoutClerkId) {
      console.log("User with missing clerkId:", user);

      await User.deleteOne({ _id: user._id });
      console.log(`Deleted user: ${user.username} (${user.email})`);
    }

    console.log("✅ Database cleanup completed");

  } catch (error) {
    console.error("❌ Database fix error:", error);
  } finally {
    process.exit(0);
  }
};

fixUsers();
