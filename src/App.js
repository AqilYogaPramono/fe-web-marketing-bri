import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/auth/login';
import Register from './views/auth/register';
import AdminDashboard from './views/admin/dashboard';
import ManajerDashboard from './views/manajer/dashboard';
import './assets/css/style.css';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/manajer/dashboard" element={<ManajerDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
