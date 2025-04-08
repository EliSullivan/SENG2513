import React, { useEffect, useState } from "react";

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

  if (loading) return <div>Loading songs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Debug View</h1>
      <h2>Raw API Response:</h2>
      <pre>{JSON.stringify(songs, null, 2)}</pre>
      
      <h2>Track Details:</h2>
      {Array.isArray(songs) ? (
        <ul>
          {songs.map((song) => (
            <li key={song.id}>
              <p><strong>Title:</strong> {song.title}</p>
              <p><strong>Artist:</strong> {song.artist}</p>
              <p><strong>Album:</strong> {song.album}</p>
              <p><strong>ID:</strong> {song.id}</p>
              {song.albumCoverUrl && (
                <div style={{margin: '10px 0'}}>
                  <p><strong>Album Cover:</strong></p>
                  <img 
                    src={song.albumCoverUrl} 
                    alt={`${song.album} cover`} 
                    style={{maxWidth: '200px', height: 'auto'}}
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
  );
};

export default Songs;