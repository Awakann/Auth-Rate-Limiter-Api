import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const createDemoAdmin = async () => {
  try {
    await connectDB();
    
    const existing = await User.findOne({
      email: process.env.DEMO_ADMIN_EMAIL,
    });

    if (existing) {
      console.log("ℹ️ Demo admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.DEMO_ADMIN_PASSWORD,
      10
    );

    await User.create({
      name: "Demo Recruit",
      email: process.env.DEMO_ADMIN_EMAIL,
      password: hashedPassword,
      role: "demoAdmin",
    });

    console.log("✅ Demo admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating demo admin:", err.message);
    process.exit(1);
  }
};

createDemoAdmin();
