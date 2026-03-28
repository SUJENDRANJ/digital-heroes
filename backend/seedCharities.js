import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Charity from './models/Charity.js';

dotenv.config();

const charities = [
  {
    name: "Green Fairways Foundation",
    description: "Focusing on environmental conservation and sustainable land management for local communities.",
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    name: "Youth Sports Initiative",
    description: "Providing equipment and coaching for underprivileged children to discover their passion for competitive sports.",
    imageUrl: "https://via.placeholder.com/150"
  },
  {
    name: "The Legacy Healthcare Fund",
    description: "Supporting medical research and mental health resources for retired athletes and their families.",
    imageUrl: "https://via.placeholder.com/150"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");
    
    // Clear existing charities
    await Charity.deleteMany({});
    
    // Insert seed data
    await Charity.insertMany(charities);
    console.log("Database Seeded Successfully!");
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
