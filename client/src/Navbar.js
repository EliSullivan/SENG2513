import './Navbar.css';
import React, { useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Songs from "./Songs";
import SongUI from "./SongUI";
import Search from "./Search";

const Navbar = () => {
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            // navigates to search page
            navigate(`/search?q=${encodeURIComponent(searchInput)}`);
        }
    };

    return (
        <>
            <div>
                <nav className="navbar">
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li>
                            <form onSubmit={handleSearchSubmit}>
                                <input 
                                    type="text" 
                                    name="search" 
                                    placeholder="Search"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <button type="submit">Search</button>
                            </form>
                        </li>
                        <li><Link to="/Songs">Library</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="*" element={<Home />} />
                    <Route path="/Songs" element={<Songs />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
                <SongUI />
            </div>
        </>
    );
};

export default Navbar;