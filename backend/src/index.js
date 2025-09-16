import express from "express";
import connectDB from "./utils/connectDB.js";
import disconnectDB from "./utils/disconnectDB.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import roomsRouter from "./routes/rooms.route.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);


// Body parsing middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/room", roomsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

// Start server
const server = app.listen(PORT, async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await disconnectDB();
  server.close(() => {
    console.log("Process terminated");
  });
});

server.on("close", async () => {
    await disconnectDB()
})