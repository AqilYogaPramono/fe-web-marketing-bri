import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from './views/auth/login';
import Register from './views/auth/register';
import AdminLayout from './components/routings/routingAdmin';
import ManajerLayout from './components/routings/routingManajer';
import './assets/css/style.css';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/*" element={<AdminLayout />} />
                    <Route path="/manajer/*" element={<ManajerLayout />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
