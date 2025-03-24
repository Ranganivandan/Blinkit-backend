import cloudinary from "../config/cloudinary.js";

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded!" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "category_images", // Save inside "category_images" folder
    });

    res.status(200).json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed!",
      error: error.message,
    });
  }
};

export default uploadImageController;
