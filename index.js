import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import multer from "multer";
import fs from "fs/promises"; // ✅ Use async-friendly fs
import { v2 as cloudinary } from "cloudinary";
import Category from "./models/category.model.js";
import connectDB from "./config/db.connect.js";

import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.route.js";

const app = express();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Multer Configuration (Temporary File Storage)
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ✅ Upload Route
app.post("/file/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded!",
      });
    }

    // ✅ Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "category_images",
    });

    // ✅ Delete the temporary file asynchronously
    await fs.unlink(req.file.path);

    // ✅ Save category in DB
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Category name is required!",
        error: true,
        success: false,
      });
    }

    const newCategory = new Category({
      name,
      image: result.secure_url, // ✅ Store Cloudinary URL instead of req.body.image
    });

    await newCategory.save();

    res.status(200).json({
      success: true,
      message: "Category added successfully!",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed!",
      error: error.message,
    });
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Your server is up and running!");
});
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);

// Database Connection & Server Start
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
