import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";

const app = express();

dotenv.config();
const PORT = process.env.PORT;

//make json can extract JSON data from the request body
app.use(express.json());

//allow to use cookie when received from client
app.use(cookieParser());

//allow port can be accessed from other domain
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow to be send cookie from client
    // allowedHeaders: ["Content-Type", "Authorization"], -> allow to send only Content-Type and Authorization from client
  })
);

//use route api
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
