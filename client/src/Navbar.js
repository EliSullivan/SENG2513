import './Navbar.css';
import React, { useState, useEffect, useCallback } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Songs from "./Songs";
import SongUI from "./SongUI";
import Search from "./Search";
import PlaylistSection from "./PlaylistSection";
import './ThemeColor.css';
import ThemeToggle from "./ThemeToggle";
import PlaylistSelect from "./PlaylistSelect";
import Queue from "./Queue"; 

const Navbar = () => {
    const [searchInput, setSearchInput] = useState("");
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]); 
    const [showQueue, setShowQueue] = useState(false);
    const navigate = useNavigate();
    const [showThemes, setShowThemes]= useState(false);

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

    // Queue management functions
    const addToQueue = (song) => {
        console.log("Adding to queue:", song);
        setQueue(prevQueue => [...prevQueue, song]);
    };

    const removeFromQueue = (index) => {
        setQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
    };

    const clearQueue = () => {
        setQueue([]);
    };

    const playNextInQueue = useCallback(() => {
        if (queue.length > 0) {
            const nextSong = queue[0];
            console.log("Playing next song from queue:", nextSong);
            
            fetch(`/api/getApiSongDetailsById/${nextSong.id}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then(trackData => {
                setCurrentSong(trackData);
                setQueue(prevQueue => prevQueue.slice(1));
              })
              .catch(error => {
                console.error("Error fetching next song details:", error);
                setCurrentSong(nextSong);
                setQueue(prevQueue => prevQueue.slice(1));
              });
        } else {
            setCurrentSong(null);
        }
    }, [queue]);

    const playFromQueue = (index) => {
        if (index >= 0 && index < queue.length) {
            const selectedSong = queue[index];
            
            fetch(`/api/getApiSongDetailsById/${selectedSong.id}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then(trackData => {
                setCurrentSong(trackData);
                setQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
              })
              .catch(error => {
                console.error("Error fetching selected song details:", error);
                setCurrentSong(selectedSong);
                setQueue(prevQueue => prevQueue.filter((_, i) => i !== index));
              });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
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
        if (!showPlaylists) {
            fetchPlaylists();
        }
    };

    const toggleQueueSection = () => {
        console.log("Toggle queue clicked");
        setShowQueue(prevState => !prevState);
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
                fetchPlaylists();
            } else {
                console.error('Failed to delete playlist');
            }
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

        
    const toggleThemeDropdown = () => {
        setShowThemes(!showThemes);
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
                            <li>
                            <button
                                className="library-button"
                                onClick={() => navigate('/Songs')}
                                type="button"
                            >
                                Library
                            </button>
                            </li>
                            <li>
                                <button 
                                    className="playlist-toggle" 
                                    onClick={togglePlaylistSection}
                                    type="button"
                                >
                                    Playlists
                                </button>
                            </li>
                            <li>
                                <button
                                    className="queue-toggle"
                                    onClick={toggleQueueSection}
                                    type="button"
                                >
                                    Queue
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="theme-toggle-btn"
                                    onClick={toggleThemeDropdown}
                                    type="button"
                                >
                                    Themes
                                </button>
                            </li>
                        </ul>
                    </div>
                                    {showThemes && (
                <div className="theme-dropdown">
                    <ThemeToggle />
                </div>
                )}
                </nav>
                
                {showPlaylists && (
                    <PlaylistSection 
                        playlists={playlists} 
                        onCreatePlaylist={handleCreatePlaylist}
                        onDeletePlaylist={handleDeletePlaylist}
                        onSongSelect={handleSongSelect}
                        onAddToQueue={addToQueue}
                    />
                )}

                {showQueue && (
                    <Queue 
                        queue={queue}
                        onRemoveSong={removeFromQueue}
                        onClearQueue={clearQueue}
                        onPlaySong={playFromQueue}
                    />
                )}
                
                <div className={`main-content ${showPlaylists || showQueue ? 'with-section-open' : ''}`}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Songs" element={<Songs onAddToQueue={addToQueue} />} />
                        <Route path="/search" element={<>
                            <Search 
                                onSongSelect={handleSongSelect} 
                                onAddToPlaylist={handleAddToPlaylist}
                                onAddToQueue={addToQueue}
                            />
                            
                            {showPlaylistModal && (
                                <PlaylistSelect 
                                    song={selectedSong}
                                    onClose={() => setShowPlaylistModal(false)}
                                />
                            )}
                        </>} />
                    </Routes>
                    <div className="songUI-container">
                        <SongUI 
                            currentSong={currentSong} 
                            queue={queue}
                            onSongEnd={playNextInQueue}
                        /> 
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
