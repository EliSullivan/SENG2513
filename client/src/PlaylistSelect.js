import React, { useState, useEffect } from 'react';
import './PlaylistSelect.css';

const PlaylistSelect = ({ song, onClose, onPlaylistUpdated }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('/api/playlist');
        
        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }
        
        const data = await response.json();
        setPlaylists(data);
        
        if (data.length > 0) {
          setSelectedPlaylistId(data[0].id);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistChange = (e) => {
    setSelectedPlaylistId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlaylistId) {
      setError('Please select a playlist');
      return;
    }
    
    setIsAdding(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/playlist/${selectedPlaylistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: song.id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add song to playlist');
      }
      
      await response.json();
      setSuccess(`Added "${song.title}" to playlist!`);
      
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="playlist-modal-overlay">
      <div className="playlist-modal">
        <div className="playlist-modal-header">
          <h2>Add to Playlist</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="playlist-modal-content">
          {isLoading ? (
            <div className="loading">Loading playlists...</div>
          ) : error && !success ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="song-info">
                <h3>{song.title}</h3>
                <p>by {song.artists}</p>
              </div>
              
              {playlists.length > 0 ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="playlist-select">Select a playlist:</label>
                    <select 
                      id="playlist-select"
                      value={selectedPlaylistId} 
                      onChange={handlePlaylistChange}
                      disabled={isAdding}
                    >
                      {playlists.map(playlist => (
                        <option key={playlist.id} value={playlist.id}>
                          {playlist.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {success && (
                    <div className="success-message">{success}</div>
                  )}
                  
                  <div className="button-group">
                    <button 
                      type="submit" 
                      className="add-button"
                      disabled={isAdding || !selectedPlaylistId}
                    >
                      {isAdding ? 'Adding...' : 'Add to Playlist'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="no-playlists">
                  <p>You don't have any playlists yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistSelect;