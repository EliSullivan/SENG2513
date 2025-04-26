import React, { useState, useRef, useEffect } from 'react';
import './PlaylistSection.css';

const PlaylistSection = ({ playlists, onCreatePlaylist, onDeletePlaylist }) => {
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [editingPlaylist, setEditingPlaylist] = useState(null);
    const [editName, setEditName] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const [localPlaylists, setLocalPlaylists] = useState(playlists);

    // Update local playlists when props change
    useEffect(() => {
        setLocalPlaylists(playlists);
    }, [playlists]);

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
                    const updatedPlaylists = localPlaylists.map(p => 
                        p.id === playlistId ? {...p, title: editName} : p
                    );
                    setLocalPlaylists(updatedPlaylists);
                    fetchPlaylists();
                    
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

    return (
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
                        <div key={playlist.id} className="playlist-item">
                            {editingPlaylist === playlist.id ? (
                                <form onSubmit={(e) => handleEditSubmit(e, playlist.id)} className="edit-form">
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
                                        <p>{playlist.songsInPlaylist.length} songs</p>
                                    </div>
                                    <div className="playlist-actions">
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
    );
};

export default PlaylistSection;
