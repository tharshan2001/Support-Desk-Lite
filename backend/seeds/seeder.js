import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.js";
import connectionDB from "../config/db.js";

dotenv.config();

// Connect to MongoDB
connectionDB()

const seedUsers = async () => {
  try {
    // Remove existing users (optional, for fresh seeding)
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);

    // Admin user
    const adminPassword = await bcrypt.hash("Admin123!", salt);
    const admin = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });

    // Agent user
    const agentPassword = await bcrypt.hash("Agent123!", salt);
    const agent = new User({
      name: "Agent User",
      email: "agent@example.com",
      password: agentPassword,
      role: "agent",
    });

    await admin.save();
    await agent.save();

    console.log("Admin and Agent seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedUsers();
