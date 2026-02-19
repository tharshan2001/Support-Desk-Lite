import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected !");
  } catch (error) {
    console.error("MongoDB connection failed: ", error.message);
    process.exit(1);
  }
};

export default connectionDB;
