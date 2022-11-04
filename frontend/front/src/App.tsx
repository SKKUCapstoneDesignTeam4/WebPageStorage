import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './routes/Login';
import MainPage from './routes/MainPage';
import NewPages from './routes/NewPages'
import StoredPages from './routes/StoredPages'
import Registered from './routes/Registered'
import Setting from './routes/Setting'
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Main" element={<MainPage />} />
          <Route path="/NewPages" element={<NewPages />} />
          <Route path="/StoredPages" element={<StoredPages />} />
          <Route path="/Registered" element={<Registered />} />
          <Route path="/Setting" element={<Setting />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;