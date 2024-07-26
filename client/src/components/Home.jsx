import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal"; 
const Home = () => {
  const baseURL = import.meta.env.VITE_BACKEND_BASEURL;
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); 

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/videos`);
        setVideos(response.data);
      } catch (error) {
        console.error(
          "Error fetching video data:",
          error.response ? error.response.data : error.message
        );
        setError(
          error.response
            ? error.response.data
            : { error: "Failed to fetch video data" }
        );
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/delete/${id}`);
      setVideos(videos.filter((video) => video._id !== id));
      console.log("Deleted Successfully");
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setModalOpen(true); // Open modal when media is selected
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setModalOpen(false); // Close modal
  };

  return (
    <div className="p-4">
      {error && (
        <div className="error mb-4 p-2 bg-red-200 text-red-800">
          <h2>Error</h2>
          <p>{error.error}</p>
          {error.details && <p>Details: {error.details}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <div
            key={video._id}
            className="border rounded-lg overflow-hidden shadow-lg bg-white p-2 relative"
          >
            <img
              src={video.imgUrl}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-32 object-cover mb-2"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={() =>
                  handleMediaClick({
                    type: "image",
                    url: video.imgUrl,
                    _id: video._id,
                  })
                }
                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
              >
                See Image
              </button>
              <button
                onClick={() =>
                  handleMediaClick({
                    type: "video",
                    url: video.videoUrl,
                    _id: video._id,
                  })
                }
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                See Video
              </button>
            </div>
            <p className="text-center mt-2">{index + 1}</p>
          </div>
        ))
      ) : (
        <h2 className="font-semibold">No media to show</h2>
      )}
         
      </div>

      {modalOpen && selectedMedia && (
        <Modal
          media={selectedMedia}
          onClose={closeModal}
          onDelete={() => handleDelete(selectedMedia._id)}
        />
      )}
    </div>
  );
};

export default Home;
