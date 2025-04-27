import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Search.css";
import "./SongUI.css";

const Search = ({ onSongSelect, onAddToPlaylist }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); //initially true
  const [error, setError] = useState("");
  const location = useLocation();
  
  const playSong = (track) => {
    if (onSongSelect) {
      onSongSelect(track);
    }
  };

  const addToPlaylist = (track) => {
    if (onAddToPlaylist) {
      onAddToPlaylist(track);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');
    
    if (!searchQuery) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          return res.json().then(err => {
            console.log(res);
            throw new Error(err.error || `HTTP error! Status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Search results received:", data);
        setSearchResults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Search error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [location.search]);

  if (loading) return <div>Loading search results...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="search-results-container">
      <h2>Search Results</h2>
      {searchResults.length > 0 ? (
        <div className="results-list">
          {searchResults.map((track) => (
            <div className="track-item" key={track.id}>
              <div className="track-info">
                <h3>{track.title}</h3>
                <p>Artist: {track.artists}</p>
                {track.album && <p className="album-name">Album: {track.album}</p>}
                {track.albumCoverUrl && (
                  <img
                    src={track.albumCoverUrl}
                    alt={`${track.title} album cover`}
                    className="album-cover"
                  />
                )}
                <button
                  className="play-song-button"
                  onClick={() => playSong(track)}
                >PLAY
                </button>
                <button className="add-to-playlist-button"
        onClick={() => addToPlaylist(track)}>Add to playlist</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">No results found</div>
      )}
    </div>
  );
};

export default Search;