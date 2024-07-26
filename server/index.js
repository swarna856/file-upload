import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import videoRoutes from "./routes/video.js"
import signUploadRoutes from "./routes/sign-upload.js"
import Video from "./models/Video.js"
import cloudinary from "cloudinary";
import deleteRoutes from "./routes/delete.js"
const router = express.Router();

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


//Express App
const app = express();
const port = process.env.PORT || 5000;

//Middlewares
app.use(cors());
app.use(express.json());

//MongoDB connection
mongoose.connect(process.env.MONGO_URL, ).then(() => {
  console.log('MongoDB Connected');
}).catch(error => {
  console.error('MongoDB connection error:', error);
});

//Routes
app.use("/api/videos", videoRoutes);
app.use("/api/sign-upload", signUploadRoutes);
app.use("/api/delete",deleteRoutes)

// Fetch all video documents from the database
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching video data:', error);
    res.status(500).json({ error: 'Failed to fetch video data', details: error.message });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
