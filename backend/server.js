import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectionDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";



dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET); // debug


const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

connectionDB();

// ---------------- Health Check ----------------
app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
