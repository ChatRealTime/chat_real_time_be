import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectDb = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connectDb.connection.host}`);
  } catch (error) {
    console.error(`Error connect DB: ${error}`);
  }
};
