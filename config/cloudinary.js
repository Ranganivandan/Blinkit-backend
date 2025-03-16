const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
  try {
    if (
      !process.env.CLOUD_NAME ||
      !process.env.API_KEY ||
      !process.env.API_SECRET
    ) {
      throw new Error(
        "Cloudinary configuration is missing. Ensure CLOUD_NAME, API_KEY, and API_SECRET are set in environment variables."
      );
    }

    cloudinary.config({
      //! Configuring Cloudinary
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    console.log("Cloudinary configuration successful.");
  } catch (error) {
    console.error("Cloudinary configuration failed:", error.message);
    throw error; // Rethrow the error for the caller to handle if necessary
  }
};

// Optional: Export Cloudinary instance
exports.cloudinary = cloudinary;
