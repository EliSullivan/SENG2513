import React, { useState, useRef, useEffect } from 'react';
import './PlaylistSection.css';
import PlaylistDetail from './PlaylistDetail';

const PlaylistSection = ({ playlists, onCreatePlaylist, onDeletePlaylist, onSongSelect, onAddToQueue, onAddToPlaylist }) => {
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [editName, setEditName] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const [localPlaylists, setLocalPlaylists] = useState(playlists);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [forceRefresh, setForceRefresh] = useState(0);

    // Update local playlists when props change
    useEffect(() => {
        setLocalPlaylists(playlists);
    }, [playlists]);

    // Force refresh selected playlist when needed
    useEffect(() => {
        if (selectedPlaylist) {
            refreshSelectedPlaylist();
        }
    }, [selectedPlaylist?.id, forceRefresh]);

    const refreshSelectedPlaylist = async () => {
        if (!selectedPlaylist || !selectedPlaylist.id) return;
        
        try {
            const response = await fetch(`/api/playlist/${selectedPlaylist.id}`);
            if (response.ok) {
                const freshPlaylist = await response.json();
                setSelectedPlaylist(freshPlaylist);
            } else {
                console.error('Failed to fetch playlist details');
            }
        } catch (error) {
            console.error('Error fetching playlist details:', error);
        }
    };

    // Set up a shared callback for playlist updates when songs are removed
    const handlePlaylistUpdated = (updatedPlaylist) => {
        console.log('Playlist updated:', updatedPlaylist);
        
        // Update local playlists list
        setLocalPlaylists(prevPlaylists => 
            prevPlaylists.map(p => p.id === updatedPlaylist.id ? updatedPlaylist : p)
        );
        
        // If this is the currently selected playlist, update it
        if (selectedPlaylist && selectedPlaylist.id === updatedPlaylist.id) {
            setSelectedPlaylist(updatedPlaylist);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            onCreatePlaylist(newPlaylistName);
            setNewPlaylistName('');
        }
    };

    const handleEditSubmit = async (e, playlistId) => {
        e.preventDefault();
        if (editName.trim()) {
            try {
                const response = await fetch(`/api/playlist/${playlistId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: editName }),
                });

                if (response.ok) {
                    const updatedPlaylist = await response.json();
                    const updatedPlaylists = localPlaylists.map(p => 
                        p.id === playlistId ? updatedPlaylist : p
                    );
                    setLocalPlaylists(updatedPlaylists);
                    
                    // If this was the selected playlist, update it
                    if (selectedPlaylist && selectedPlaylist.id === playlistId) {
                        setSelectedPlaylist(updatedPlaylist);
                    }
                    
                    // Reset edit state
                    setEditingPlaylist(null);
                    setEditName('');
                } else {
                    console.error('Failed to update playlist');
                }
            } catch (error) {
                console.error('Error updating playlist:', error);
            }
        }
    };

    const fetchPlaylists = async () => {
        try {
            const response = await fetch('/api/playlist');
            if (response.ok) {
                const data = await response.json();
                setLocalPlaylists(data);
            } else {
                console.error('Failed to fetch playlists');
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    const startEdit = (playlist) => {
        setEditingPlaylist(playlist.id);
        setEditName(playlist.title);
        setOpenMenuId(null); // Close menu when editing starts
    };

    const toggleMenu = (playlistId) => {
        setOpenMenuId(openMenuId === playlistId ? null : playlistId);
    };

    const handlePlaylistClick = async (playlist) => {
        if (editingPlaylist === playlist.id) return;
        
        try {
            // Fetch the latest version of the playlist to get updated songs
            const response = await fetch(`/api/playlist/${playlist.id}`);
            if (response.ok) {
                const freshPlaylist = await response.json();
                setSelectedPlaylist(freshPlaylist);
            } else {
                console.error('Failed to fetch playlist details');
                setSelectedPlaylist(playlist);
            }
        } catch (error) {
            console.error('Error fetching playlist details:', error);
            setSelectedPlaylist(playlist);
        }
    };

    const closePlaylistDetail = () => {
        setSelectedPlaylist(null);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Pass the onAddToPlaylist callback function to parent components
    useEffect(() => {
        if (onAddToPlaylist) {
            onAddToPlaylist(null);
        }
    }, [onAddToPlaylist]);

    return (
        <>
            <div className="playlist-section">
                <div className="playlist-header">
                    <h2>Your Playlists</h2>
                    <form onSubmit={handleSubmit} className="create-playlist-form">
                        <input
                            type="text"
                            placeholder="New playlist name"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                        />
                        <button type="submit">Create</button>
                    </form>
                </div>
                
                <div className="playlist-list">
                    {localPlaylists.length > 0 ? (
                        localPlaylists.map(playlist => (
                            <div 
                                key={playlist.id} 
                                className={`playlist-item ${selectedPlaylist?.id === playlist.id ? 'selected' : ''}`}
                                onClick={() => handlePlaylistClick(playlist)}
                            >
                                {editingPlaylist === playlist.id ? (
                                    <form 
                                        onSubmit={(e) => handleEditSubmit(e, playlist.id)} 
                                        className="edit-form"
                                        onClick={(e) => e.stopPropagation()} // Prevent click on form from selecting playlist
                                    >
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="edit-actions">
                                            <button type="submit" className="save-button">Save</button>
                                            <button 
                                                type="button" 
                                                className="cancel-button"
                                                onClick={() => setEditingPlaylist(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="playlist-info">
                                            <h3>{playlist.title}</h3>
                                        </div>
                                        <div 
                                            className="playlist-actions"
                                            onClick={(e) => e.stopPropagation()} // Prevent click on actions from selecting playlist
                                        >
                                            <button 
                                                className="menu-button"
                                                onClick={() => toggleMenu(playlist.id)}
                                                aria-label="Playlist options"
                                            >
                                                <span className="dots">⋮</span>
                                            </button>
                                            {openMenuId === playlist.id && (
                                                <div className="dropdown-menu" ref={menuRef}>
                                                    <button onClick={() => startEdit(playlist)}>
                                                        Edit name
                                                    </button>
                                                    <button onClick={() => {
                                                        onDeletePlaylist(playlist.id);
                                                        setOpenMenuId(null);
                                                        if (selectedPlaylist?.id === playlist.id) {
                                                            setSelectedPlaylist(null);
                                                        }
                                                    }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="empty-playlists">No playlists yet. Create one!</p>
                    )}
                </div>
            </div>
            
            {selectedPlaylist && (
                <PlaylistDetail 
                    key={`playlist-detail-${selectedPlaylist.id}-${forceRefresh}`}
                    playlist={selectedPlaylist} 
                    onClose={closePlaylistDetail}
                    onPlaySong={onSongSelect}
                    onAddToQueue={onAddToQueue}
                    onPlaylistUpdated={handlePlaylistUpdated}
                />
            )}
        </>
    );
};

export default PlaylistSection;