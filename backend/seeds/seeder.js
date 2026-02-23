import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.js";
import connectionDB from "../config/db.js";

dotenv.config();

// Connect to MongoDB
connectionDB();

const seedUsers = async () => {
  try {
    const salt = await bcrypt.genSalt(10);

    // Admin user
    const adminExists = await User.findOne({ email: "sdl0admin@gmail.com" });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash("Admin123!", salt);
      const admin = new User({
        name: "Admin User",
        email: "sdl0admin@gmail.com",
        password: adminPassword,
        role: "admin",
      });
      await admin.save();
      console.log("Admin seeded successfully!");
    } else {
      console.log("Admin already exists");
    }

    // Agent user
    const agentExists = await User.findOne({ email: "agent0sdl@gmail.com" });
    if (!agentExists) {
      const agentPassword = await bcrypt.hash("Agent123!", salt);
      const agent = new User({
        name: "Agent User",
        email: "agent0sdl@gmail.com",
        password: agentPassword,
        role: "agent",
      });
      await agent.save();
      console.log("Agent seeded successfully!");
    } else {
      console.log("Agent already exists");
    }

    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedUsers();
