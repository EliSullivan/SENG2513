// Navbar.jsx
import "./Navbar.css"
import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Companies from "./Companies";
import Users from "./Users";
import Songs from "./Songs";
const Navbar = () => {
    return (
        <>
            <div>
                <nav className="navbar">
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><input type="text" name="search" placeholder="Search"></input></li>
                        <li><Link to="/Playlist">Playlist 1</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="*" element={<Home />} />
                    <Route path="/Playlist" element={<Playlist />} /> 
                </Routes>
            </div>

        </>
    );
};

export default Navbar;