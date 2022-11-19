import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './routes/Login';
import StoredPages from './routes/StoredPages';
import Bookmark from './routes/Bookmark'
import Registered from './routes/Registered'
import Setting from './routes/Setting'

function App() {
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