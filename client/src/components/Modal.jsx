import React, { useEffect, useRef } from "react";
import axios from "axios";

const Modal = ({ media, onClose, onDelete }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = media.url;
    link.download = media.type === 'image' ? 'download.jpg' : 'download.mp4';
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    try {
      await onDelete(); 
      onClose(); 
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-4 rounded-lg relative w-full sm:w-11/12 md:w-1/2 lg:w-1/3 max-w-4xl mx-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          &times; {/* Close icon */}
        </button>
        <div className="mb-4">
          {media.type === 'image' ? (
            <img src={media.url} alt="Selected" className="w-full h-auto" />
          ) : (
            <video controls className="w-full h-auto">
              <source src={media.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Download {media.type === 'image' ? 'Image' : 'Video'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete {media.type === 'image' ? 'Image' : 'Video'}
        </button>
      </div>
    </div>
  );
};

export default Modal;
