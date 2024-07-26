import { v2 as cloudinary } from "cloudinary";
import Video from "../models/Video.js";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to extract public ID from URL
const extractPublicId = (url, resourceType) => {
  const segments = url.split('/');
  const filename = segments.pop();
  const publicIdWithExtension = filename.split('.')[0];

  return resourceType === 'video' ? `video/${publicIdWithExtension}` : `image/${publicIdWithExtension}`;
};

export const deleteVideoAndImage = async (req, res) => {
  try {
    const videoId = req.params.id;

    if (!videoId) {
      return res.status(400).json({ error: "Video ID is required" });
    }
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Extract public IDs from URLs
    const imgPublicId = extractPublicId(video.imgUrl, "image");
    const videoPublicId = extractPublicId(video.videoUrl, "video");

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(imgPublicId, { resource_type: "image" });
    await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });

    // Delete from database
    await Video.findByIdAndDelete(videoId);

    res.status(200).json({ message: "Video and associated image deleted successfully" });
  } catch (error) {
    console.error("Error deleting video and image:", error);
    res.status(500).json({
      error: "Failed to delete video and image",
      details: error.message,
    });
  }
};
