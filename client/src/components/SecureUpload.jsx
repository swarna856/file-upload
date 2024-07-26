import React, { useState } from "react";
import { Circles } from "react-loader-spinner";
import axios from "axios";

const SecureUpload = () => {
  const baseURL = import.meta.env.VITE_BACKEND_BASEURL;
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSignature = async (type) => {
    try {
      const response = await axios.post(`${baseURL}/api/sign-upload`, {
        folder: type,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching signature for ${type}:`,
        error.response ? error.response.data : error.message
      );
      return {};
    }
  };

  const uploadFile = async (type) => {
    const file = type === "image" ? img : video;
    if (!file) {
      console.error(`No ${type} file selected`);
      return;
    }

    try {
      // Get signature and timestamp
      const { timestamp, signature } = await fetchSignature(type);

      // Upload to Cloudinary
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const resourceType = type === "image" ? "image" : "video";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const data = new FormData();
      data.append("file", file);
      data.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      data.append("timestamp", timestamp);
      data.append("signature", signature);
      data.append("folder", type);

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(`${type} uploaded successfully: ${secure_url}`);
      return secure_url;
    } catch (error) {
      console.error(
        `Error uploading ${type}:`,
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload image file
      const imgUrl = await uploadFile("image");
      // Upload video file
      const videoUrl = await uploadFile("video");

      // Send API request
      if (imgUrl || videoUrl) {
        // Hardcoded backend URL for saving URLs
        await axios.post(`${baseURL}/api/videos`, {
          imgUrl,
          videoUrl,
        });
        setImg(null);
        setVideo(null);
        console.log("Files uploaded successfully");
      } else {
        console.error("No files uploaded");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Upload Video</h2>
        <input
          type="file"
          placeholder="Choose File"
          accept="video/*"
          id="video"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <h2>Upload Image</h2>
        <input
          type="file"
          placeholder="Choose File"
          accept="image/*"
          id="image"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      {loading && (
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      )}
    </div>
  );
};

export default SecureUpload;
