import React, { useState, useEffect } from 'react';
import './PlaylistDetail.css';

const PlaylistDetail = ({ playlist, onClose, onPlaySong, onAddToQueue }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    if (playlist && playlist.id) {
      fetchCurrentPlaylist();
    } else {
      setPlaylistData(null);
      setSongs([]);
      setLoading(false);
    }
  }, [playlist]);

  useEffect(() => {
    if (playlistData && playlistData.songsInPlaylist && playlistData.songsInPlaylist.length > 0) {
      fetchSongDetails(playlistData.songsInPlaylist);
    } else if (playlistData) {
      setSongs([]);
      setLoading(false);
    }
  }, [playlistData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.song-menu-container')) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const fetchCurrentPlaylist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/playlist/${playlist.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setPlaylistData(data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setPlaylistData(null);
      setLoading(false);
    }
  };

  const fetchSongDetails = async (songIds) => {
    if (!songIds || songIds.length === 0) {
      setSongs([]);
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`/api/getApiSongDetailsById?ids=${songIds.join(',')}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const songsArray = Array.isArray(data) ? data : [data];
      setSongs(songsArray);
      setLoading(false);
      return;
    } catch (error) {
      console.error("Bulk request failed, trying individual requests:", error);
    }
  
    await fetchSongsIndividually(songIds);
  };

  const fetchSongsIndividually = async (songIds) => {
    try {
      const songPromises = songIds.map(id => 
        fetch(`/api/getApiSongDetailsById/${id}`)
          .then(res => res.ok ? res.json() : null)
          .catch(err => {
            console.error(`Error fetching song ${id}:`, err);
            return null;
          })
      );
      
      const fetchedSongs = await Promise.all(songPromises);
      setSongs(fetchedSongs.filter(Boolean));
    } catch (error) {
      console.error("Error fetching individual songs:", error);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSong = async (index) => {
    if (!playlistData || !playlistData.id) return;
    
    try {
      const songId = songs[index].id;
      
      const updatedSongs = [...songs];
      updatedSongs.splice(index, 1);
      setSongs(updatedSongs);
      
      const response = await fetch(`/api/playlist/${playlistData.id}/songs/${songId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedPlaylist = await response.json();
      setPlaylistData(updatedPlaylist);
      
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      fetchCurrentPlaylist();
    }
  };

  const toggleMenu = (songId) => {
    setOpenMenuId(openMenuId === songId ? null : songId);
  };

  if (!playlistData) return null;

  return (
    <div className="playlist-detail">
      <div className="playlist-detail-header">
        <h2>{playlistData.title}</h2>
        <p>{songs.length} songs</p>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="playlist-songs">
        {loading ? (
          <div className="loading">Loading songs...</div>
        ) : songs.length > 0 ? (
          <ul className="song-list">
            {songs.map((song, index) => (
              <li key={song.id || index} className="song-item">
                {song.albumCoverUrl && (
                  <div className="song-cover">
                    <img src={song.albumCoverUrl} alt={`${song.album} cover`} />
                  </div>
                )}
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
                <div className="song-menu-container">
                  <button 
                    className="menu-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(song.id || index);
                    }}
                  >
                    ⋮
                  </button>
                  {openMenuId === (song.id || index) && (
                    <div className="song-menu">
                      <button onClick={() => {
                        onPlaySong(song);
                        setOpenMenuId(null);
                      }}>
                        Play
                      </button>
                      <button onClick={() => {
                        onAddToQueue(song);
                        setOpenMenuId(null);
                      }}>
                        Add to Queue
                      </button>
                      <button 
                        className="remove-button"
                        onClick={() => {
                          handleRemoveSong(index);
                          setOpenMenuId(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-playlist">This playlist is empty</div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;