import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./index.css";

const App = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-black">
        Upload Files using Cloudinary Service in MERN Stack project
      </h1>
      <Link to="/home" className="text-base p-2 hover:text-blue-600">
        Home
      </Link>{" "}
      |{" "}
      <Link to="/upload" className="text-base p-2 hover:text-blue-600">
        Upload
      </Link>{" "}
      |{" "}
      <Link to="/secure-upload" className="text-base p-2 hover:text-blue-600">
        Secure Upload
      </Link>
      <br />
      <br />
      <Outlet />
    </div>
  );
};

export default App;
