import React, { useState } from "react";
import { Circles } from "react-loader-spinner";
import axios from "axios";

const Upload = () => {
  const baseURL = import.meta.env.VITE_BACKEND_BASEURL;
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (type) => {
    const file = type === "image" ? img : video;
    if (!file) {
      console.error(`No ${type} file selected`);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      type === "image" ? "image_preset" : "videos_preset"
    );

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const resourceType = type === "image" ? "image" : "video";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
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
    try {
      setLoading(true);
      //Upload image file
      const imgUrl = await uploadFile("image");
      //upload video file
      const videoUrl = await uploadFile("video");

      // Send Api request
      await axios.post(`${baseURL}/api/videos`, {
        imgUrl,
        videoUrl,
      });

      setImg(null);
      setVideo(null);
      console.log("File uploaded Successfully");
      setLoading(false);
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

export default Upload;
