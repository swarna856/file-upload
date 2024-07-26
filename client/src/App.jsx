import React from 'react'
import { Link, Outlet } from 'react-router-dom'


const App = () => {
  return (
    <div>
     <h1>Upload Files using Cloudinary Service in MERN Stack project</h1>
     <Link to = "/">Home</Link> | <Link to ="/upload">Upload</Link> | <Link to = "/secure-upload">Secure Upload</Link>
     <br/>
     <br/>
     <Outlet />
    </div>
  )
}

export default App
