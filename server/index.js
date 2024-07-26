import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import videoRoutes from "./routes/video.js"
import signUploadRoutes from "./routes/sign-upload.js"


dotenv.config();

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

//Use this middleware


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
