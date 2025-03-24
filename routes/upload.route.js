import { Router } from "express";
import { auth } from "../middleware/auth.js"; // Ensure auth middleware is correctly implemented
import upload from "../middleware/multer.js"; // Multer middleware for handling file uploads
import uploadImageController from "../controllers/uploadimage.controleers.js"; // Import the controller

const uploadRouter = Router();

// ✅ POST request to upload image
uploadRouter.post(
  "/upload",
  auth,
  upload.single("image"),
  uploadImageController
);

export default uploadRouter;
