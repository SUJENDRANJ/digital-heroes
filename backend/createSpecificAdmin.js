import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminEmail = "admin@mail.com";
    const adminPassword = "Admin@123";
    
    let adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
      adminUser.role = "admin";
      await adminUser.save();
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      adminUser = await User.create({
        name: "Super Admin",
        email: adminEmail,
        passwordHash,
        role: "admin",
      });
    }

    console.log("Admin account created successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
