import React, { useEffect, useState } from "react";
import "./Songs.css";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/song`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Raw API response:", data);
        setSongs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-container">Loading songs...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  return (
    <div className="songs-container">
      <div className="songdata">
        {Array.isArray(songs) ? (
          <ul className="songs-list">
            {songs.map((song) => (
              <li key={song.id} className="song-item">
                <p><strong>Title:</strong> {song.title}</p>
                <p><strong>Artist:</strong> {song.artist}</p>
                <p><strong>Album:</strong> {song.album}</p>
                <p><strong>ID:</strong> {song.id}</p>
                {song.albumCoverUrl && (
                  <div className="album-cover-container">
                    <p><strong>Album Cover:</strong></p>
                    <img
                      src={song.albumCoverUrl}
                      alt={`${song.album} cover`}
                      className="album-cover"
                    />
                  </div>
                )}
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <p>Data is not in array format: {typeof songs}</p>
        )}
      </div>
    </div>
  );
};

export default Songs;