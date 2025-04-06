// Users.jsx

import React from "react";
import { useEffect, useState } from "react";

const Playlist = () => {

  const [playlist, setplaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    
    fetch(`/api/playlist`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
          setplaylist(data); // Ensure data is an array
          setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
        <div style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <h1>Playlist 1</h1>
        </div>
        <div>
          {Array.isArray(playlist) && playlist.length > 0 ? (
            playlist.map((data) => (
                <p key={data.id}>{data.title}</p>
            ))
          ) : (
            <p>No playlist found or data is not in expected format.</p>
          )}
        </div>
    </>
  );
}

export default Playlist;