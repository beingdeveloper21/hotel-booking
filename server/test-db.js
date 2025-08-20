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

const testDatabase = async () => {
  await connectDB();

  try {
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    const users = await User.find({}).limit(5);
    console.log("👥 Sample users:", users.map(u => ({
      id: u.clerkId,
      username: u.username,
      email: u.email,
      role: u.role
    })));

    const testUser = {
      clerkId: "test_user_123",
      username: "Test User",
      email: "test@example.com",
      image: "https://example.com/image.jpg",
      role: "user",
      recentSearchedCities: ["Test City"]
    };

    await User.deleteOne({ clerkId: "test_user_123" });

    const createdUser = await User.create(testUser);
    console.log("✅ Test user created successfully:", createdUser);

    await User.deleteOne({ clerkId: "test_user_123" });
    console.log("🧹 Test user cleaned up");

  } catch (error) {
    console.error("❌ Database test error:", error);
  } finally {
    process.exit(0);
  }
};

testDatabase();
