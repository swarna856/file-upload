import React, { useState } from "react";
import { Circles } from "react-loader-spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SecureUpload = () => {
  const baseURL = import.meta.env.VITE_BACKEND_BASEURL;
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImgUrl, setUploadedImgUrl] = useState(""); 
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(""); 
  const navigate = useNavigate();

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
      const { timestamp, signature } = await fetchSignature(type);
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
      navigate("/home");
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
      const imgUrl = await uploadFile("image");
      const videoUrl = await uploadFile("video");
      // Send API request
      if (imgUrl || videoUrl) {
        const res= await axios.post(`${baseURL}/api/videos`, {
          imgUrl,
          videoUrl,
        });
        setImg(null);
        setVideo(null);
        setUploadedImgUrl(res.data.imgUrl);
        setUploadedVideoUrl(res.data.videoUrl);
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
      <div>
        <p className="font-bold text-3xl">SECURE UPLOAD</p>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl text-black font-bold p-2">Upload Video</h2>
          <input
            type="file"
            placeholder="Choose File"
            accept="video/*"
            id="video"
            onChange={(e) => setVideo(e.target.files[0])}
          />
          <h2 className="text-xl text-black font-bold p-2">Upload Image</h2>
          <input
            type="file"
            placeholder="Choose File"
            accept="image/*"
            id="image"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <div>
            <button className="text-white px-4 py-2 bg-blue-600 fot-semibold rounded-xl my-6 mx-2" type="submit">Upload</button>
          </div>
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
      
    </div>
  );
};

export default SecureUpload;
