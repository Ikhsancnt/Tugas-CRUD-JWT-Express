import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Create from './components/Create';
import Update from './components/Update';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/create" element={<><Navbar /><Create /></>} />
        <Route path="/update/:id" element={<><Navbar /><Update /></>} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
