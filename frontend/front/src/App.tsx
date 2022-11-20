import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './routes/Login';
import StoredPages from './routes/StoredPages';
import Bookmark from './routes/Bookmark'
import Registered from './routes/Registered'
import Setting from './routes/Setting'

function App() {
  axios.defaults.baseURL = "https://wps-server.cube219.me/";
  // axios.defaults.baseURL = "http://localhost:4000/";
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/StoredPages" element={<StoredPages />} />
          <Route path="/Bookmark" element={<Bookmark />} />
          <Route path="/Registered" element={<Registered />} />
          <Route path="/Setting" element={<Setting />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;