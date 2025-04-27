import './Navbar.css';
import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Songs from "./Songs";
import SongUI from "./SongUI";
import Search from "./Search";
import PlaylistSection from "./PlaylistSection";
import PlaylistSelect from "./PlaylistSelect";

const Navbar = () => {
    const [searchInput, setSearchInput] = useState("");
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [currentSong, setCurrentSong] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const response = await fetch('/api/playlist');
            if (response.ok) {
                const data = await response.json();
                setPlaylists(data);
            } else {
                console.error('Failed to fetch playlists');
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    const handleSongSelect = (song) => {
        console.log("Selected song:", song);
        
        fetch(`/api/getApiSongDetailsById/${song.id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(trackData => {
            setCurrentSong(trackData);
          })
          .catch(error => {
            console.error("Error fetching song details:", error);
          });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            // navigates to search page
            navigate(`/search?q=${encodeURIComponent(searchInput)}`);
        }
    };

const [selectedSong, setSelectedSong] = useState(null);
const [showPlaylistModal, setShowPlaylistModal] = useState(false);

const handleAddToPlaylist = (song) => {
  setSelectedSong(song);
  setShowPlaylistModal(true);
};
    const togglePlaylistSection = () => {
        console.log("Toggle playlist clicked");
        setShowPlaylists(prevState => !prevState);
        // Refresh playlists when opening the playlist section
        if (!showPlaylists) {
            fetchPlaylists();
        }
    };

    const handleCreatePlaylist = async (playlistName) => {
        try {
            console.log("Creating playlist:", playlistName);
            const response = await fetch('/api/playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: playlistName, songsInPlaylist: [] }),
            });

            if (response.ok) {
                // Refresh playlists after creating a new one
                fetchPlaylists();
            } else {
                console.error('Failed to create playlist');
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    const handleDeletePlaylist = async (playlistId) => {
        try {
            console.log("Deleting playlist:", playlistId);
            const response = await fetch(`/api/playlist/${playlistId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Refresh playlists after deletion
                fetchPlaylists();
            } else {
                console.error('Failed to delete playlist');
            }
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };



    
    return (
        <>
            <div className="app-container">
                <nav className="navbar">
                    <div className="navbar-content">
                        <h1 className="app-title">Music Player</h1>
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
                            <li>
                                <button 
                                    className="playlist-toggle" 
                                    onClick={togglePlaylistSection}
                                    type="button"
                                >
                                    Playlists {showPlaylists}
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
                
                {showPlaylists && (
                    <PlaylistSection 
                        playlists={playlists} 
                        onCreatePlaylist={handleCreatePlaylist}
                        onDeletePlaylist={handleDeletePlaylist}
                    />
                )}
                
                <div className={`main-content ${showPlaylists ? 'with-playlist-open' : ''}`}>
                    <Routes>
                        <Route path="*" element={<Home />} />
                        <Route path="/Songs" element={<Songs />} />
                        <Route path="/search" element={<>
    <Search 
      onSongSelect={handleSongSelect} 
      onAddToPlaylist={handleAddToPlaylist} 
    />
    
    {showPlaylistModal && (
      <PlaylistSelect 
      song={selectedSong}
      onClose={() => setShowPlaylistModal(false)}
      /*onCreatePlaylist={handleCreatePlaylist}*/
      />
    )}
  </>} />
                    </Routes>
                    <div className="songUI-container">
                        <SongUI currentSong={currentSong} /> 
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;